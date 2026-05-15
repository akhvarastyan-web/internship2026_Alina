import { SmallHeader } from '../common/Headers';
import { UploadZone } from './UploadZone';

export const CreateGallery = () => {
  return (
    <section>
      <div>
        <SmallHeader>Upload Photos</SmallHeader>
        <p></p>
      </div>

      <div>
        <UploadZone />
      </div>
      <div>
        <button></button>
      </div>
    </section>
  )
}
