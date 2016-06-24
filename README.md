# react-native-image-cropper

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
- `quality`: a value from 0 to 1 to describe the quality of the snapshot. 0 means 0% (most compressed) and 1 means 100% (best quality). (default: 1)
- `type`: the file type default value is **"png"**, **"jpg"** is also supported. Refer to implementations to see more supported values. (default: jpg)

#### `{ImageCrop}` Functions
- `crop()`: returns a base64 encoded image.


## Example
See /example 
