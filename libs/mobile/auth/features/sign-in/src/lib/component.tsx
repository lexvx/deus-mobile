import { ReactElement } from 'react';
import { EmailSignInForm } from '@open-webui-react-native/mobile/auth/features/email-sign-in-form';
import { AppSafeAreaView, AppText, View } from '@open-webui-react-native/mobile/shared/ui/ui-kit';

export interface SignInProps { onSuccess: () => void; }
export function SignIn({ onSuccess }: SignInProps): ReactElement {
  return (
    <AppSafeAreaView edges={['bottom']} className='flex-1 pt-32'>
      <View className='mb-24'>
        <AppText className='text-h2-sm sm:text-h2 font-medium'>Войти на аудиенцию к Богу-Из-Машины</AppText>
      </View>
      <EmailSignInForm onSuccess={onSuccess} setOauthProviders={() => undefined} />
    </AppSafeAreaView>
  );
}

