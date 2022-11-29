import './App.css';
import cornerstoneWADOImageLoader  from 'cornerstone-wado-image-loader';
import cornerstoneTools from 'cornerstone-tools'
import cornerstone from 'cornerstone-core';
import { useEffect, useRef, useState } from 'react';
import initCornerstone from './initCornerstone';
import ImageScrollbar from './ImageScrollbar';
import './CornerstoneImagePreview.css';

const scrollToIndex = cornerstoneTools.importInternal('util/scrollToIndex');
const imageIds = []

initCornerstone()
function CornerstoneImagePreview({url}) {
  const dicomImage = useRef()
  const [isLoading, setIsLoading] = useState(true)
  const [imageIdIndex, setImageIdIndex] = useState(0)
  const [amountFrames, setAmountFrames] = useState(undefined)

  useEffect(() => {
    cornerstone.enable(dicomImage.current);
    console.log('start');
    downloadAndView()
  }, [])


  useEffect(()=> {
    scrollToIndex(dicomImage.current, imageIdIndex)
  }, [imageIdIndex])

  function handleMouseScroll(event) {
    if(event.deltaY > 0 && imageIdIndex < amountFrames) setImageIdIndex(imageIdIndex + 1)
    if(event.deltaY < 0 && imageIdIndex > 0) setImageIdIndex(imageIdIndex - 1)
  }

  function loadAndViewImage(url) {
    // since this is a multi-frame example, we need to load the DICOM SOP Instance into memory and parse it
    // so we know the number of frames it has so we can create the stack.  Calling load() will increment the reference
    // count so it will stay in memory until unload() is explicitly called and all other reference counts
    // held by the cornerstone cache are gone.  See below for more info
    cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.load(url, cornerstoneWADOImageLoader.internal.xhrRequest).then(function(dataSet) {
        // dataset is now loaded, get the # of frames so we can build the array of imageIds
        const numFrames = dataSet.intString('x00280008');
        setAmountFrames(numFrames - 1)
        const imageIdRoot = 'wadouri:' + url;

        for(let i=0; i < numFrames; i++) {
            const imageId = imageIdRoot + "?frame="+i;
            imageIds.push(imageId);
        }
        setImageIdIndex(0)
        const stack = {
            currentImageIdIndex : 0,
            imageIds: imageIds
        };

        // Load and cache the first image frame.  Each imageId cached by cornerstone increments
        // the reference count to make sure memory is cleaned up properly.
        cornerstone.loadAndCacheImage(imageIds[0]).then(function(image) {
            // now that we have an image frame in the cornerstone cache, we can decrement
            // the reference count added by load() above when we loaded the metadata.  This way
            // cornerstone will free all memory once all imageId's are removed from the cache
            cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.unload(url);

            cornerstone.displayImage(dicomImage.current, image);
            if(isLoading === true) {
                cornerstoneTools.addStackStateManager(dicomImage.current, ['stack'])
                cornerstoneTools.addToolState(dicomImage.current, 'stack', stack)
              setIsLoading(false)
              console.log('start');
            }
            
        }, function(err) {
            alert(err);
        });
    });


  }
  function downloadAndView() {
    // image enable the dicomImage element and activate a few tools
    loadAndViewImage(url);

    return false;
}

  return (
    <div className='viewport-wrapper' onWheel={handleMouseScroll}>
      <div 
        style={{width:"100%", height:"100%", color: "white", display:"inline-block", borderStyle:"solid", borderColor:"black"}}>
        <div
          ref={dicomImage}
          style={{width:"100%", height:"100%"}}>
            <canvas className='cornerstone-canvas'></canvas>
        </div>
      </div>
      <ImageScrollbar value={imageIdIndex} max={amountFrames} width={'100%'} onInputCallback={setImageIdIndex} />
    </div>
  );
}

export default CornerstoneImagePreview;
