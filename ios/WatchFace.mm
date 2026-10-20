#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>

@interface RCTConvert (CustomType)

+ (NSString *)NSString:(id)json;

@end

@implementation RCTConvert (CustomType)

+ (NSString *)NSString:(id)json
{
    return [NSString stringWithFormat:@"%@", json];
}

@end

@interface RCT_EXTERN_MODULE(WatchFace, NSObject)

RCT_EXTERN_METHOD(addWatchFace:(NSString *)path
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getBatteryStatus:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
