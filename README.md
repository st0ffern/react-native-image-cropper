# react-native-image-crop

This Image cropper is based on the gl-react-native [library](https://github.com/ProjectSeptemberInc/gl-react-native)


#### `{ImageCrop}` Props

- `image` **(required)**: link to image that should be cropped.
- `cropHeight` **(required)**: height of the image in cropped size.
- `cropWidth` **(required)**: width of the image in cropped size.
- `zoom`: range 0 - 100 setting zoom value. where 100 = full zoom. (default: 0)
- `maxZoom`: max zoom value, should be bigger than minZoom value (default: 100)
- `minZoom`: min zoom value, should be smaller than maxZoom value (default: 0) 
- `panToMove`: Use pan to move image? (default: true)
- `pinchToZoom` Use pinch to zoom image? (default: true)

## Example

```html
<ImageCrop 
	ref={'cropper'}
	image={this.state.image}
	cropHeight={this.state.height}
	cropWidth={this.state.width}
	zoom={this.state.zoom}
	maxZoom={80}
	minZoom={20}
	panToMove={true}
	pinchToZoom={true}
/>
```
