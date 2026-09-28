package com.sunnyui.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sunnyui.models.NativeApp

@Composable
fun NativeAppDrawer(
    apps: List<NativeApp>,
    onClose: () -> Unit,
    onLaunchApp: (NativeApp) -> Unit,
    modifier: Modifier = Modifier
) {
    var query by remember { mutableStateOf("") }
    val filtered = remember(query, apps) {
        val q = query.trim().lowercase()
        if (q.isEmpty()) apps else apps.filter { it.label.lowercase().contains(q) || it.packageName.lowercase().contains(q) }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xDD111111))
            .padding(horizontal = 18.dp, vertical = 42.dp)
    ) {
        Text("All Apps", color = Color.White, fontSize = 28.sp)
        Spacer(Modifier.height(14.dp))
        OutlinedTextField(
            value = query,
            onValueChange = { query = it },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            placeholder = { Text("Search apps", color = Color.White.copy(alpha = .65f)) },
            colors = TextFieldDefaults.colors(
                focusedContainerColor = Color.White.copy(alpha = .10f),
                unfocusedContainerColor = Color.White.copy(alpha = .08f),
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White,
                cursorColor = Color.White,
                focusedIndicatorColor = Color.White.copy(alpha = .45f),
                unfocusedIndicatorColor = Color.White.copy(alpha = .20f)
            ),
            shape = RoundedCornerShape(20.dp)
        )
        Spacer(Modifier.height(18.dp))
        LazyVerticalGrid(
            columns = GridCells.Fixed(4),
            modifier = Modifier.fillMaxSize(),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(18.dp)
        ) {
            items(filtered, key = { it.packageName }) { app ->
                NativeAppIcon(app, onClick = { onLaunchApp(app) })
            }
        }
    }
}
