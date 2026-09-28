package com.sunnyui.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sunnyui.models.AppDefinition
import com.sunnyui.models.SolarState

@Composable
fun AppDrawer(
    apps: List<AppDefinition>,
    solarState: SolarState,
    onClose: () -> Unit,
    onLaunchApp: (AppDefinition) -> Unit,
    modifier: Modifier = Modifier
) {
    val isDark = solarState.themeMode == "dark" ||
                 (solarState.themeMode == "auto" && (solarState.sunPosition > 82 || solarState.sunPosition < 15))

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(if (isDark) Color.Black.copy(alpha = 0.8f) else Color.White.copy(alpha = 0.8f))
            .clickable { onClose() }
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(top = 48.dp, start = 16.dp, end = 16.dp)
                .clickable(enabled = false) {} // Prevent click-through
        ) {
            Text(
                text = "App Library",
                color = if (isDark) Color.White else Color.Black,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 24.dp)
            )

            LazyVerticalGrid(
                columns = GridCells.Fixed(4),
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalArrangement = Arrangement.spacedBy(24.dp)
            ) {
                items(apps) { app ->
                    AppIcon(app = app, onClick = { onLaunchApp(app) })
                }
            }
        }
    }
}
