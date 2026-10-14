"""Release delivery helpers. The legacy state is the last acknowledged release."""
import argparse
import json
import os
from pathlib import Path
import sys
import urllib.error
import urllib.request

STATE = Path('.github/state/open-webui-last-release.txt')


def changed(tag, state=STATE):
    if not tag or '\n' in tag or '\r' in tag:
        raise ValueError('Invalid release tag')
    return not state.exists() or state.read_text().strip() != tag


def notify(tag, url, webhook):
    if not webhook:
        raise ValueError('GOOGLE_CHAT_WEBHOOK_URL is missing')
    payload = json.dumps({'text': f'New open-webui release: {tag}\n{url}'}).encode()
    request = urllib.request.Request(webhook, data=payload,
                                     headers={'Content-Type': 'application/json'}, method='POST')
    # One attempt per run: an ambiguous timeout must not cause a burst of duplicates.
    # HTTP errors / network failures fail the job; the next run retries unchanged state.
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            if not 200 <= response.status < 300:
                raise RuntimeError('Google Chat did not acknowledge delivery')
    except (urllib.error.URLError, TimeoutError):
        # Never include the secret webhook URL or server response in logs.
        raise RuntimeError('Google Chat delivery failed; state remains unchanged') from None


def save(tag, state=STATE):
    state.parent.mkdir(parents=True, exist_ok=True)
    temporary = state.with_suffix('.tmp')
    temporary.write_text(tag)
    temporary.replace(state)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('operation', choices=['detect', 'notify', 'save'])
    args = parser.parse_args()
    tag = os.environ['RELEASE_TAG']
    if args.operation == 'detect':
        result = changed(tag)
        with open(os.environ['GITHUB_OUTPUT'], 'a') as output:
            output.write(f'changed={str(result).lower()}\n')
    elif args.operation == 'notify':
        notify(tag, os.environ['RELEASE_URL'], os.environ.get('GOOGLE_CHAT_WEBHOOK_URL', ''))
    else:
        save(tag)


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)
