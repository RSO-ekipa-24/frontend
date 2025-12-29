import {Tag} from '../../settings/tags/models/tag.model';

export interface Property {
  id: string;
  name: string;
  description?: string;
  tags: Tag[];
}
