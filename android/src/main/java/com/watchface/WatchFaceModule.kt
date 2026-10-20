package com.watchface

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap

class WatchFaceModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun addWatchFace(path: String, promise: Promise) {
    // En Android se simula o maneja la acción
    promise.resolve(true)
  }

  @ReactMethod
  fun getBatteryStatus(promise: Promise) {
    try {
      val ifilter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
      val batteryStatus: Intent? = reactApplicationContext.registerReceiver(null, ifilter)

      val level: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
      val scale: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
      val status: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1

      val isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
                       status == BatteryManager.BATTERY_STATUS_FULL

      val batteryPct = if (level >= 0 && scale > 0) {
        Math.round((level / scale.toFloat()) * 100f)
      } else {
        100
      }

      val result: WritableMap = Arguments.createMap()
      result.putInt("level", batteryPct)
      result.putBoolean("charging", isCharging)
      result.putBoolean("supported", true)

      promise.resolve(result)
    } catch (e: Exception) {
      promise.reject("BATTERY_ERROR", e.message, e)
    }
  }

  companion object {
    const val NAME = "WatchFace"
  }
}
