package com.sunnyui.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sunnyui.models.AppDefinition
import com.sunnyui.models.SolarState
import com.sunnyui.ui.theme.*

@Composable
fun StatusBar(
    solarState: SolarState,
    onOpenNotifications: () -> Unit,
    onOpenControlCenter: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isDark = solarState.themeMode == "dark" ||
                 (solarState.themeMode == "auto" && (solarState.sunPosition > 82 || solarState.sunPosition < 15))
    val contentColor = if (isDark) Color.White else Color.Black

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Left - Time
        Text(
            text = "2:30", // Placeholder for actual time derived from solarState
            color = contentColor,
            fontWeight = FontWeight.Bold,
            fontSize = 14.sp,
            modifier = Modifier.clickable { onOpenNotifications() }
        )

        // Right - Icons
        Row(
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.clickable { onOpenControlCenter() }
        ) {
            Text(text = if (solarState.wifiEnabled) "📶" else "📵", fontSize = 14.sp)
            Text(text = "${solarState.batteryLevel}%", color = contentColor, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            Text(text = "🔋", fontSize = 14.sp)
        }
    }
}

@Composable
fun GlassDock(
    dockApps: List<AppDefinition>,
    onLaunchApp: (AppDefinition) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .padding(horizontal = 16.dp, vertical = 16.dp)
            .fillMaxWidth()
            .clip(RoundedCornerShape(32.dp))
            .background(Color.White.copy(alpha = 0.3f))
            .padding(16.dp),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalAlignment = Alignment.CenterVertically
    ) {
        dockApps.forEach { app ->
            AppIcon(app = app, onClick = { onLaunchApp(app) })
        }
    }
}

@Composable
fun AppIcon(
    app: AppDefinition,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    size: Int = 60
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier.clickable(onClick = onClick)
    ) {
        Box(
            modifier = Modifier
                .size(size.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(Color(android.graphics.Color.parseColor(app.accentColor))),
            contentAlignment = Alignment.Center
        ) {
            Text(text = app.iconEmoji, fontSize = (size / 2).sp)

            if (app.badge > 0) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .offset(x = 4.dp, y = (-4).dp)
                        .size(20.dp)
                        .clip(CircleShape)
                        .background(Color.Red),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = app.badge.toString(),
                        color = Color.White,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = app.name,
            color = Color.White,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            maxLines = 1
        )
    }
}

@Composable
fun GestureBar(
    onGoHome: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(bottom = 8.dp, top = 4.dp)
            .clickable { onGoHome() },
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .width(120.dp)
                .height(4.dp)
                .clip(CircleShape)
                .background(Color.White.copy(alpha = 0.5f))
        )
    }
}
