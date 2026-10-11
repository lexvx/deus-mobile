import { plainToInstance } from 'class-transformer';
import { getApiService } from '@open-webui-react-native/shared/data-access/api-client';

import { TranscriptionAudio } from './models';

export class AudioService {
  public async transcribeAudio(formData: FormData): Promise<TranscriptionAudio> {
    const file = await getApiService().post<{ data: { content: string }; filename: string }>('v1/files/', formData);
    const response = { text: file.data.content, filename: file.filename };

    return plainToInstance(TranscriptionAudio, response);
  }
}

export const audioService = new AudioService();

