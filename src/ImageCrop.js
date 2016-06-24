import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Image,
  PanResponder
} from 'react-native';

import {Surface} from 'gl-react-native'
const {Image: GLImage} = require("gl-react-image");

class ImageCrop extends Component {
	constructor(props) {
		super(props);
		this.state = {
			zoom: 1,
			//pan settings
			centerX: 0.5,
			centerY: 0.5,
			//Image sizes
			imageHeight: 300,
			imageWidth: 300,
			currentCapture: '',
		};
	}

	componentWillMount(){
		var zoom = (100 - this.props.zoom)/100;
		this.setState({ zoom: zoom })

		this._panOffsetX= 0;
		this._panOffsetY= 0;
		this._panResponder = PanResponder.create({

			onStartShouldSetPanResponder: (evt, gestureState) => true,
			onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
			onMoveShouldSetPanResponder: (evt, gestureState) => true,
			onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
			onPanResponderTerminationRequest: (evt, gestureState) => true,
			onShouldBlockNativeResponder: (evt, gestureState) => true,

			onPanResponderGrant: (evt, gestureState) => {
				//move variables
				this.offsetX = this.state.centerX;
				this.offsetY = this.state.centerY;

				//zoom variables
				this.zoomLastDistance=0;
				this.zoomCurrentDistance=0;
			},

			onPanResponderMove: (evt, gestureState) => {
				//We are moving the image
				if (evt.nativeEvent.changedTouches.length <= 1){
					if (this.props.panToMove){

						var trackX = (gestureState.dx/this.props.cropWidth)*this.state.zoom;
						var trackY = (gestureState.dy/this.props.cropHeight)*this.state.zoom;
						var newPosX = (Number(this.offsetX) - Number(trackX));
						var newPosY = (Number(this.offsetY) - Number(trackY));
						if (newPosX> 1) newPosX = Number(1);
						if (newPosY> 1) newPosY = Number(1);
						if (newPosX< 0) newPosX = Number(0);
						if (newPosY< 0) newPosY = Number(0);

						this.setState({centerX: newPosX})
						this.setState({centerY: newPosY})
						this._panOffsetX = gestureState.dx*this.state.zoom;
						this._panOffsetY = gestureState.dy*this.state.zoom;
					}
				}else{
				//We are zooming the image
					if (this.props.pinchToZoom){
						//Pinch activated
						if (this.zoomLastDistance == 0){
							let a = evt.nativeEvent.changedTouches[0].locationX - evt.nativeEvent.changedTouches[1].locationX
							let b = evt.nativeEvent.changedTouches[0].locationY - evt.nativeEvent.changedTouches[1].locationY
							let c = Math.sqrt( a*a + b*b );
							this.zoomLastDistance = c.toFixed(1);
						}else{
							let a = evt.nativeEvent.changedTouches[0].locationX - evt.nativeEvent.changedTouches[1].locationX
							let b = evt.nativeEvent.changedTouches[0].locationY - evt.nativeEvent.changedTouches[1].locationY
							let c = Math.sqrt( a*a + b*b );
							this.zoomCurrentDistance = c.toFixed(1);
							
							//what is the zoom level
							var screenDiagonal = Math.sqrt(this.state.imageHeight*this.state.imageHeight + this.state.imageWidth*this.state.imageWidth);
							var distance = (this.zoomCurrentDistance-this.zoomLastDistance)/400;
							var zoom = this.state.zoom-distance;

							if (zoom<0.3)zoom=0.3;
							if (zoom>1)zoom=1;
							this.setState({
								zoom: zoom,
							})
							//Set last distance..
							this.zoomLastDistance=this.zoomCurrentDistance;
						}
					}
				}
			},
		});
		Image.getSize(this.props.image, (width, height) => {
			this.setState({
				imageHeight: height,
				imageWidth: width,
			});
		});
	}
	componentWillReceiveProps(nextProps){
		var zoom = (100 - nextProps.zoom)/100;
		this.setState({ zoom: zoom })
	}
  	render() {
	    return (
      		<View {...this._panResponder.panHandlers}>
      			<Surface width={this.props.cropWidth} height={this.props.cropHeight} ref="cropit">
					<GLImage
						source={{ uri: this.props.image, height: this.state.imageHeight, width: this.state.imageWidth}}
						resizeMode="cover"
						zoom={this.state.zoom}
						center={[ this.state.centerX, this.state.centerY ]}
					/>
      			</Surface>
      		</View>
	    );
  	}
  	crop(){
  		return this.refs.cropit.captureFrame({quality: this.props.quality, type: this.props.type, format: this.props.format})
  	}
}

ImageCrop.defaultProps = {
	image: '',
	cropWidth: 300,
	cropHeight: 300,
	zoomFactor: 0,
	minZoom: 0,
	maxZoom: 100,
	quality: 1,
	type: 'jpg',
	format: 'base64',
}
ImageCrop.propTypes = {
	image: React.PropTypes.string.isRequired,
	cropWidth: React.PropTypes.number.isRequired,
	cropHeight: React.PropTypes.number.isRequired,
	zoomFactor: React.PropTypes.number,
	maxZoom: React.PropTypes.number,
	minZoom: React.PropTypes.number,
	quality: React.PropTypes.number,
	type: React.PropTypes.string,
	format: React.PropTypes.string,
}

module.exports=ImageCrop;