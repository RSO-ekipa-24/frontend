import {Component, computed, input} from '@angular/core';
import {Property} from '../../models/property.model';
import {GalleriaModule} from 'primeng/galleria';
import {FileUploadComponent} from '../../../../../shared/components/file-upload/file-upload.component';
import {InputText} from 'primeng/inputtext';
import {ReactiveFormsModule} from '@angular/forms';
import {
  TagSelectMultipleComponent
} from '../../../../../shared/components/tag-select-multiple/tag-select-multiple.component';
import {TranslatePipe} from '@ngx-translate/core';
import {TagComponent} from '../../../../../shared/components/tag/tag.component';
import {Card} from 'primeng/card';

@Component({
  selector: 'app-property-details-data',
  imports: [
    GalleriaModule,
    FileUploadComponent,
    InputText,
    ReactiveFormsModule,
    TagSelectMultipleComponent,
    TranslatePipe,
    TagComponent,
    Card
  ],
  templateUrl: './property-details-data.component.html',
  styleUrl: './property-details-data.component.scss'
})
export class PropertyDetailsDataComponent {
  property = input<Property | null>();

  public images = [
    {
      itemImageSrc: 'https://www.swedenestates.com/images/slider_img/MED453BCB19C6AD4B1BB218A65EFC527545.jpg',
      thumbnailImageSrc: 'https://www.swedenestates.com/images/slider_img/MED453BCB19C6AD4B1BB218A65EFC527545.jpg',
      alt: 'Description for Image 1',
      title: 'Title 1'
    },
    {
      itemImageSrc: 'https://www.swedenestates.com/images/slider_img/MED9254C774CB2D48E8BE8B5CA0944DBD12.jpg',
      thumbnailImageSrc: 'https://www.swedenestates.com/images/slider_img/MED9254C774CB2D48E8BE8B5CA0944DBD12.jpg',
      alt: 'Description for Image 2',
      title: 'Title 2'
    },
    {
      itemImageSrc: 'https://www.swedenestates.com/images/slider_img/MEDBC88B59906D84F739B42CCF5FC5A0094.jpg',
      thumbnailImageSrc: 'https://www.swedenestates.com/images/slider_img/MEDBC88B59906D84F739B42CCF5FC5A0094.jpg',
      alt: 'Description for Image 2',
      title: 'Title 2'
    },
    {
      itemImageSrc: 'https://www.swedenestates.com/images/slider_img/MED69CA7F5A1684412EB8FDD47FB6197382.jpg',
      thumbnailImageSrc: 'https://www.swedenestates.com/images/slider_img/MED69CA7F5A1684412EB8FDD47FB6197382.jpg',
      alt: 'Description for Image 2',
      title: 'Title 2'
    },
    {
      itemImageSrc: 'https://www.swedenestates.com/images/slider_img/MEDF531B2415EB44D77B10219F7613FB00E.jpg',
      thumbnailImageSrc: 'https://www.swedenestates.com/images/slider_img/MEDF531B2415EB44D77B10219F7613FB00E.jpg',
      alt: 'Description for Image 2',
      title: 'Title 2'
    },
    {
      itemImageSrc: 'https://www.swedenestates.com/images/slider_img/MEDEFE983CF76504E659D7F7984FF52163B.jpg',
      thumbnailImageSrc: 'https://www.swedenestates.com/images/slider_img/MEDEFE983CF76504E659D7F7984FF52163B.jpg',
      alt: 'Description for Image 2',
      title: 'Title 2'
    },
  ]
}
