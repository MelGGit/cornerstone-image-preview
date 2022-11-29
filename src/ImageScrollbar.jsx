
import './ImageScrollbar.css';

function ImageScrollbar(props) {
  const { value, max, width, onInputCallback } = props
  // static propTypes = {
  //   value: PropTypes.number.isRequired,
  //   max: PropTypes.number.isRequired,
  //   height: PropTypes.string.isRequired,
  //   onInputCallback: PropTypes.func.isRequired,
  // };

    const style = {
      width: `${width}`,
    };
    
    const onKeyDown = event => {
      // We don't allow direct keyboard up/down input on the
      // image sliders since the natural direction is reversed (0 is at the top)
  
      // Store the KeyCodes in an object for readability
      const keys = {
        DOWN: 40,
        UP: 38,
      };
  
      // TODO: Enable scroll down / scroll up without depending on ohif-core
      if (event.which === keys.DOWN) {
        //OHIF.commands.run('scrollDown');
        event.preventDefault();
      } else if (event.which === keys.UP) {
        //OHIF.commands.run('scrollUp');
        event.preventDefault();
      }
    };
    const onChange = event => {
      const intValue = parseInt(event.target.value, 10);
      onInputCallback(intValue);
    };
    if(max === 0) return null

    return (
      <div className="scroll">
        <div className="scroll-holder">
          <input
            className="imageSlider"
            style={style}
            type="range"
            min="0"
            max={max}
            step="1"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
    );
}

export default ImageScrollbar
