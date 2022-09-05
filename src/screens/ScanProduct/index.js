import React from 'react';
import {View, Text, TouchableOpacity, Linking, Image} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {MotiView, useAnimationState} from 'moti';
import {Shadow} from 'react-native-shadow-2';
import {Svg, Defs, Rect, Mask} from 'react-native-svg';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';

import {IconButton, TextButton} from '../../components';
import {icons, constants, images, COLORS, FONTS, SIZES} from '../../constants';

const ScanProduct = ({navigation}) => {
  // State
  const [selectedOption, setSelectedOption] = React.useState(
    constants.scan_product_option.camera,
  );

  // Camera
  const devices = useCameraDevices();
  const device = devices.back;

  // Moti
  const loaderAnimationState = useAnimationState({
    start: {opacity: 1},
    stop: {opacity: 0},
  });

  const productAnimationState = useAnimationState({
    hide: {opacity: 0, translateY: -10},
    show: {opacity: 1, translateY: 10},
  });

  // Barcode
  const [barcode, setBarcode] = React.useState('');
  const [isScanned, setIsScanned] = React.useState(false);

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);

  React.useEffect(() => {
    if (selectedOption === constants.scan_product_option.qr) {
      toggleActiveState();
    }
  }, [barcodes]);

  React.useEffect(() => {
    // Animation
    productAnimationState.transitionTo('hide');
    loaderAnimationState.transitionTo('stop');

    // Permission
    requestCameraPermission();
  }, []);

  // Handler
  const requestCameraPermission = React.useCallback(async () => {
    const permission = await Camera.requestCameraPermission();

    if (permission === 'denied') {
      await Linking.openSettings();
    }
  }, []);

  const toggleActiveState = async () => {
    if (barcodes && barcodes.length > 0 && isScanned === false) {
      setIsScanned(true);

      barcodes.forEach(async scannedBarcode => {
        if (scannedBarcode.rawValue !== '') {
          setBarcode(scannedBarcode.rawValue);
          productAnimationState.transitionTo('show');
        }
      });
    }
  };

  // Render
  const renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingTop: SIZES.padding * 2,
          paddingBottom: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          alignItems: 'center',
          backgroundColor: COLORS.light,
          zIndex: 1,
        }}>
        {/* Close */}
        <IconButton icon={icons.close} onPress={() => navigation.goBack()} />

        {/* Title */}
        <Text
          style={{
            flex: 1,
            marginLeft: SIZES.radius,
            ...FONTS.h2,
            color: COLORS.dark,
          }}>
          {selectedOption === constants.scan_product_option.camera
            ? 'Scan Camera'
            : 'Scan QR Code'}
        </Text>

        {/* Add. options */}
        <IconButton icon={icons.flash} iconStyle={{width: 25, height: 25}} />
        <IconButton
          icon={icons.question_mark}
          containerStyle={{marginLeft: SIZES.base}}
          iconStyle={{width: 25, height: 25}}
        />
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 90,
          paddingTop: SIZES.radius,
          paddingHorizontal: SIZES.radius,
          backgroundColor: COLORS.light,
        }}>
        <TextButton
          label="Scan QR Code"
          contentContainerStyle={{
            flex: 1,
            height: 55,
            borderRadius: SIZES.radius,
            backgroundColor:
              selectedOption === constants.scan_product_option.qr
                ? COLORS.primary
                : COLORS.lightGrey,
          }}
          labelStyle={{
            ...FONTS.h3,
            color:
              selectedOption === constants.scan_product_option.qr
                ? COLORS.secondary
                : COLORS.primary,
          }}
          onPress={() => {
            setSelectedOption(constants.scan_product_option.qr);
          }}
        />

        <TextButton
          label="Scan Camera"
          contentContainerStyle={{
            flex: 1,
            height: 55,
            marginLeft: SIZES.radius,
            borderRadius: SIZES.radius,
            backgroundColor:
              selectedOption === constants.scan_product_option.camera
                ? COLORS.primary
                : COLORS.lightGrey,
          }}
          labelStyle={{
            ...FONTS.h3,
            color:
              selectedOption === constants.scan_product_option.camera
                ? COLORS.secondary
                : COLORS.primary,
          }}
          onPress={() => {
            setSelectedOption(constants.scan_product_option.camera);
          }}
        />
      </View>
    );
  };

  const CameraFrame = () => {
    return (
      <Svg height="100%" width="100%">
        <Defs>
          <Mask id="mask" x="0" y="0" height="100%" width="100%">
            <Rect height="100%" width="100%" fill="#fff" />
            <Rect x="18%" y="30%" width="250" height="250" fill="black" />
          </Mask>
        </Defs>

        <Rect
          height="100%"
          width="100%"
          fill="rgba(0, 0, 0, 0.8)"
          mask="url(#mask)"
        />

        {/* Frame Border */}
        <Rect
          x="18%"
          y="30%"
          height="250"
          width="250"
          strokeWidth="5"
          stroke="#fff"
        />
      </Svg>
    );
  };

  const renderCamera = () => {
    if (device) {
      return (
        <View style={{flex: 1}}>
          <Camera
            style={{flex: 1}}
            device={device}
            isActive={true}
            enableZoomGesture
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />

          {/* Loading / Searching View */}
          <MotiView
            state={loaderAnimationState}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.dark60,
            }}>
            <Text style={{...FONTS.h2, color: COLORS.light}}>Searching</Text>
          </MotiView>

          {/* Scan Button */}
          {selectedOption === constants.scan_product_option.camera && (
            <View
              style={{
                position: 'absolute',
                alignItems: 'center',
                bottom: SIZES.padding,
                left: 0,
                right: 0,
              }}>
              <IconButton
                icon={icons.scan}
                containerStyle={{
                  height: 60,
                  width: 60,
                  borderRadius: 30,
                  allignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.light,
                }}
                iconStyle={{width: 50, height: 50, tintColor: COLORS.primary}}
                onPress={() => {
                  loaderAnimationState.transitionTo('start');

                  setTimeout(() => {
                    loaderAnimationState.transitionTo('stop');
                    productAnimationState.transitionTo('show');
                  }, 2000);
                }}
              />
            </View>
          )}

          {/* QR Code */}
          {selectedOption === constants.scan_product_option.qr && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}>
              <CameraFrame />

              {/* Label 1 */}
              <View
                style={{
                  position: 'absolute',
                  top: '15%',
                  left: 0,
                  right: 0,
                  alignItems: 'center',
                }}>
                <Text style={{...FONTS.h1, color: COLORS.light}}>Scan...</Text>
              </View>

              {/* Label 2 */}
              <View
                style={{
                  position: 'absolute',
                  top: SIZES.height * 0.3 + 220,
                  left: 0,
                  right: 0,
                  alignItems: 'center',
                }}>
                <Text style={{...FONTS.body3, color: COLORS.light}}>
                  Align the code to be in the middle of the box
                </Text>
              </View>
            </View>
          )}

          {/* Product */}
          <MotiView
            state={productAnimationState}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 120,
              paddingVertical: SIZES.radius,
              alignItems: 'center',
              zIndex: 1,
            }}>
            <Shadow>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  width: SIZES.width - SIZES.padding * 2,
                  alignItems: 'center',
                  paddingHorizontal: SIZES.radius,
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.light,
                }}>
                {/* Image */}
                <Image
                  source={images.luggage_01}
                  style={{width: 60, height: 60, borderRadius: 30}}
                />

                {/* Product name & SKU */}
                <View style={{flex: 1, marginLeft: SIZES.radius}}>
                  <Text style={{...FONTS.h3, color: COLORS.primary}}>
                    Vali Sakos
                  </Text>
                  <Text style={{...FONTS.body4, color: COLORS.dark}}>
                    SKU: 12345678
                  </Text>
                </View>

                {/* Price */}
                <Text style={{...FONTS.h3, color: COLORS.primary}}>
                  $ 67.00
                </Text>
              </TouchableOpacity>
            </Shadow>
          </MotiView>
        </View>
      );
    } else {
      return <View style={{flex: 1}}>{}</View>;
    }
  };

  return (
    <View style={{flex: 1}}>
      {/* Header */}
      {renderHeader()}

      {/* Camera */}
      {renderCamera()}

      {/* Footer */}
      {renderFooter()}
    </View>
  );
};

export default ScanProduct;
