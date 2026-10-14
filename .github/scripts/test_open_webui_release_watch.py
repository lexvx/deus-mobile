import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
import urllib.error

from open_webui_release_watch import changed, notify, save


class ReleaseWatchTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.state = Path(self.directory.name) / 'release.txt'
        self.state.write_text('v0.12.0')

    def run_watch(self, tag):
        if changed(tag, self.state):
            notify(tag, 'https://example.org/release', 'https://example.org/webhook')
            save(tag, self.state)

    @patch('urllib.request.urlopen')
    def test_unchanged_version_never_sends(self, send):
        self.run_watch('v0.12.0')
        send.assert_not_called()
        self.assertEqual(self.state.read_text(), 'v0.12.0')

    def test_new_release_detected_without_state_change(self):
        self.assertTrue(changed('v0.12.1', self.state))
        self.assertEqual(self.state.read_text(), 'v0.12.0')

    @patch('urllib.request.urlopen')
    def test_success_saves_and_next_run_does_not_send(self, send):
        send.return_value.__enter__.return_value.status = 200
        self.run_watch('v0.12.1')
        self.assertEqual(self.state.read_text(), 'v0.12.1')
        self.run_watch('v0.12.1')
        send.assert_called_once()

    @patch('urllib.request.urlopen')
    def test_http_failure_and_retry(self, send):
        send.side_effect = urllib.error.HTTPError('url', 503, 'Unavailable', {}, None)
        with self.assertRaises(RuntimeError):
            self.run_watch('v0.12.1')
        self.assertEqual(self.state.read_text(), 'v0.12.0')
        send.side_effect = None
        send.return_value.__enter__.return_value.status = 200
        self.run_watch('v0.12.1')
        self.run_watch('v0.12.1')
        self.assertEqual(send.call_count, 2)
        self.assertEqual(self.state.read_text(), 'v0.12.1')

    @patch('urllib.request.urlopen')
    def test_network_failure_keeps_state(self, send):
        for error in (urllib.error.URLError('offline'), TimeoutError()):
            send.side_effect = error
            with self.assertRaises(RuntimeError):
                self.run_watch('v0.12.1')
            self.assertEqual(self.state.read_text(), 'v0.12.0')

    @patch('urllib.request.urlopen')
    def test_missing_secret_fails_without_request(self, send):
        with self.assertRaises(ValueError):
            notify('v0.12.1', 'url', '')
        send.assert_not_called()
        self.assertEqual(self.state.read_text(), 'v0.12.0')


if __name__ == '__main__':
    unittest.main()
