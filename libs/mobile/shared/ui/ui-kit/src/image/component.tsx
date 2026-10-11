import { Image, ImageProps } from 'expo-image';
import { ReactElement } from 'react';
import { withClassNameInterop } from '@open-webui-react-native/mobile/shared/ui/styles';

export interface AppImageProps extends ImageProps {
  authorizationToken?: string;
  className?: string;
}

function AppImage({ source, authorizationToken, ...props }: AppImageProps): ReactElement {
  return (
    <Image
      source={
        typeof source === 'object'
          ? { headers: authorizationToken && source && 'uri' in source && typeof source.uri === 'string' && source.uri.startsWith('https://ai.lex42.ru/') ? { Authorization: `Bearer ${authorizationToken}` } : undefined, ...source }
          : source
      }
      {...props}
    />
  );
}

withClassNameInterop(AppImage);

export { AppImage };
