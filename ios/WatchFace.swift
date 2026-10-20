import Foundation
import UIKit
import ClockKit

@objc(WatchFace)
class WatchFace: NSObject {

  @objc(addWatchFace:withResolver:withRejecter:)
  func addWatchFace(path: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
      let library = CLKWatchFaceLibrary()
      let srcUrl: URL = URL(fileURLWithPath: "\(path)")

      library.addWatchFace(at: srcUrl) { (error) in
          if let error = error {
              reject("event_failure", "An error occurred: \(error.localizedDescription)", error)
          } else {
              resolve(true)
          }
      }
  }

  @objc(getBatteryStatus:withRejecter:)
  func getBatteryStatus(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
      DispatchQueue.main.async {
          UIDevice.current.isBatteryMonitoringEnabled = true
          let rawLevel = UIDevice.current.batteryLevel
          let state = UIDevice.current.batteryState

          let isCharging = (state == .charging || state == .full)
          let levelPct = rawLevel >= 0 ? Int(round(rawLevel * 100)) : 100

          let result: [String: Any] = [
              "level": levelPct,
              "charging": isCharging,
              "supported": true
          ]
          resolve(result)
      }
  }
}
