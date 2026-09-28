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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sunnyui.models.NativeApp

@Composable
fun NativeHomeScreen(
    apps: List<NativeApp>,
    onLaunchApp: (NativeApp) -> Unit,
    onOpenDrawer: () -> Unit,
    onSetDefault: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(modifier.fillMaxSize().padding(horizontal = 16.dp, vertical = 12.dp)) {
        Box(
            Modifier.fillMaxWidth().height(150.dp).clip(RoundedCornerShape(28.dp))
                .background(Brush.verticalGradient(listOf(Color(0xFFFFD76A), Color(0xFFE8871E))))
                .padding(20.dp)
        ) {
            Column {
                Text("Sunny UI", color = Color.White, fontSize = 26.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(4.dp))
                Text("Your phone. Your style.", color = Color.White.copy(alpha = .9f), fontSize = 14.sp)
                Spacer(Modifier.weight(1f))
                Text("${apps.size} apps available", color = Color.White.copy(alpha = .9f), fontSize = 13.sp)
            }
        }
        Spacer(Modifier.height(16.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            ActionPill("All Apps", Modifier.weight(1f), onOpenDrawer)
            ActionPill("Set as Home", Modifier.weight(1f), onSetDefault)
        }
        Spacer(Modifier.height(18.dp))
        LazyVerticalGrid(
            columns = GridCells.Fixed(4),
            modifier = Modifier.fillMaxSize(),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(18.dp)
        ) {
            items(apps.take(12), key = { it.packageName }) { app ->
                NativeAppIcon(app, onClick = { onLaunchApp(app) })
            }
        }
    }
}

@Composable
private fun ActionPill(text: String, modifier: Modifier, onClick: () -> Unit) {
    Box(
        modifier.clip(RoundedCornerShape(20.dp)).background(Color.White.copy(alpha = .22f)).clickable(onClick = onClick).padding(vertical = 12.dp),
        contentAlignment = Alignment.Center
    ) { Text(text, color = Color.White, fontWeight = FontWeight.SemiBold) }
}

@Composable
fun GlassNativeDock(apps: List<NativeApp>, onLaunch: (NativeApp) -> Unit) {
    Row(
        Modifier.padding(horizontal = 16.dp, vertical = 10.dp).fillMaxWidth()
            .clip(RoundedCornerShape(30.dp)).background(Color.White.copy(alpha = .28f)).padding(14.dp),
        horizontalArrangement = Arrangement.SpaceEvenly
    ) { apps.forEach { NativeAppIcon(it, { onLaunch(it) }, size = 52) } }
}
