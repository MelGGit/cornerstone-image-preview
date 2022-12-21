import { Suspense } from 'react';
import CornerstoneImagePreview from './CornerstoneImagePreview';

function App() {
const url = 'https://stgrippersistencedev.blob.core.windows.net/preview/combined?sp=r&st=2022-11-25T16:07:38Z&se=2022-12-01T00:07:38Z&spr=https&sv=2021-06-08&sr=b&sig=y41oy8ZwCOyJbp7RACXLqQ0UXv2pSzDt%2FWv8MkBoMSo%3D'

  return (
    <div className="App">
      <header className="App-header">
        <Suspense fallback={<p>Loading...</p>}>
        <div className="flex gap-2">
          <div style={{width: '512px', height: '512px'}}>
            <CornerstoneImagePreview url={url} />
          </div>
        </div>
        </Suspense>
      </header>
    </div>
  );
}

export default App;
