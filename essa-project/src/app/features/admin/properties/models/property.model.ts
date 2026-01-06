import {Tag} from '../../settings/tags/models/tag.model';
import {ImagePreviewResponse} from '../../../../shared/models/file.model';

export interface Property {
  id: string;
  name: string;
  description?: string;
  tags: Tag[];
  images: ImagePreviewResponse[];
}
