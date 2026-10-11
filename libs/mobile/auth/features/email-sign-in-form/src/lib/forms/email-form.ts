import { i18n } from '@ronas-it/react-native-common-modules/i18n';
import * as Yup from 'yup';
import { serverUrlValidator } from '@open-webui-react-native/mobile/shared/utils/validation';

export class EmailFormSchema {
  public email: string;
  public password: string;
  public url?: string;

  constructor(schema?: Partial<EmailFormSchema>) {
    this.email = schema?.email || '';
    this.password = schema?.password || '';
    this.url = schema?.url || '';
  }

  public static get validationSchema(): Yup.ObjectSchema<EmailFormSchema> {
    return Yup.object().shape({
      email: Yup.string().trim().matches(/^[a-z0-9][a-z0-9_.-]{2,31}$/, 'Логин: 3–32 символа, латинские буквы, цифры, точка, дефис или _').required('Введите логин'),
      password: Yup.string().required(i18n.t('SHARED.VALIDATION.TEXT_REQUIRED_PASSWORD')),
      url: serverUrlValidator(),
    });
  }
}

