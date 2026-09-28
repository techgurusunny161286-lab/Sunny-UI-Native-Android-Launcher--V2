package com.sunnyui.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Slider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sunnyui.models.SolarState

@Composable
fun ControlCenter(
    solarState: SolarState,
    onClose: () -> Unit,
    onUpdateBrightness: (Int) -> Unit,
    onUpdateVolume: (Int) -> Unit,
    onToggleWifi: () -> Unit,
    onToggleBluetooth: () -> Unit,
    onToggleFlashlight: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.5f))
            .clickable { onClose() },
        contentAlignment = Alignment.TopEnd
    ) {
        Column(
            modifier = Modifier
                .fillMaxHeight(0.7f)
                .fillMaxWidth(0.8f)
                .padding(top = 40.dp, end = 16.dp)
                .clip(RoundedCornerShape(32.dp))
                .background(Color.White.copy(alpha = 0.9f))
                .clickable(enabled = false) {}
                .padding(24.dp)
        ) {
            Text("Control Center", fontWeight = FontWeight.Bold, fontSize = 20.sp, modifier = Modifier.padding(bottom = 16.dp))

            // Toggles
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp), modifier = Modifier.padding(bottom = 24.dp)) {
                ToggleButton("Wi-Fi", "📶", solarState.wifiEnabled, onToggleWifi)
                ToggleButton("Bluetooth", "🛜", solarState.bluetoothEnabled, onToggleBluetooth)
                ToggleButton("Flashlight", "🔦", solarState.flashlightEnabled, onToggleFlashlight)
            }

            // Sliders
            Text("Brightness", fontWeight = FontWeight.Medium, fontSize = 14.sp)
            Slider(
                value = solarState.brightness / 100f,
                onValueChange = { onUpdateBrightness((it * 100).toInt()) }
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text("Volume", fontWeight = FontWeight.Medium, fontSize = 14.sp)
            Slider(
                value = solarState.volume / 100f,
                onValueChange = { onUpdateVolume((it * 100).toInt()) }
            )
        }
    }
}

@Composable
fun ToggleButton(label: String, icon: String, enabled: Boolean, onClick: () -> Unit) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.clickable(onClick = onClick)) {
        Box(
            modifier = Modifier
                .size(60.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(if (enabled) Color(0xFF3B82F6) else Color.LightGray),
            contentAlignment = Alignment.Center
        ) {
            Text(icon, fontSize = 24.sp)
        }
        Spacer(modifier = Modifier.height(4.dp))
        Text(label, fontSize = 12.sp)
    }
}
