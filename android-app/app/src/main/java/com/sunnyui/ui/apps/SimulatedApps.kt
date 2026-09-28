package com.sunnyui.ui.apps

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sunnyui.models.AppDefinition
import com.sunnyui.models.NoteItem
import com.sunnyui.models.SolarState

@Composable
fun SimulatedAppWindow(
    app: AppDefinition,
    solarState: SolarState,
    notes: List<NoteItem>,
    onAddNote: (String, String) -> Unit,
    onDeleteNote: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Color.White) // Adjust for dark mode later
    ) {
        when (app.id) {
            "suntrack" -> WeatherApp(solarState)
            "solarnotes" -> NotesApp(notes, onAddNote, onDeleteNote)
            "solarcalc" -> CalculatorApp()
            "solarcore" -> SettingsApp(solarState)
            else -> GenericApp(app)
        }
    }
}

@Composable
fun WeatherApp(solarState: SolarState) {
    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("SunTrack Weather", fontSize = 24.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 32.dp))
        Text("${solarState.temperature}°", fontSize = 72.sp, fontWeight = FontWeight.Bold, color = Color(0xFFF59E0B))
        Text(solarState.weatherCondition, fontSize = 24.sp, color = Color.Gray)
        Spacer(modifier = Modifier.height(48.dp))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
            WeatherStat("UV Index", "${solarState.uvIndex}")
            WeatherStat("Wattage", "${solarState.solarWattage}W")
        }
    }
}

@Composable
fun WeatherStat(label: String, value: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(label, color = Color.Gray, fontSize = 14.sp)
        Text(value, fontSize = 20.sp, fontWeight = FontWeight.Bold)
    }
}

@Composable
fun NotesApp(notes: List<NoteItem>, onAddNote: (String, String) -> Unit, onDeleteNote: (String) -> Unit) {
    var isAddingNote by remember { mutableStateOf(false) }
    var newTitle by remember { mutableStateOf("") }
    var newContent by remember { mutableStateOf("") }

    if (isAddingNote) {
        Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
            Text("New Note", fontSize = 24.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 16.dp))
            TextField(
                value = newTitle,
                onValueChange = { newTitle = it },
                label = { Text("Title") },
                modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
            )
            TextField(
                value = newContent,
                onValueChange = { newContent = it },
                label = { Text("Content") },
                modifier = Modifier.fillMaxWidth().weight(1f).padding(bottom = 16.dp)
            )
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Button(onClick = { isAddingNote = false }) {
                    Text("Cancel")
                }
                Button(onClick = {
                    if (newTitle.isNotBlank() || newContent.isNotBlank()) {
                        onAddNote(if (newTitle.isNotBlank()) newTitle else "Untitled", newContent)
                    }
                    isAddingNote = false
                    newTitle = ""
                    newContent = ""
                }) {
                    Text("Save")
                }
            }
        }
    } else {
        Box(modifier = Modifier.fillMaxSize()) {
            LazyColumn(
                modifier = Modifier.fillMaxSize().padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                item {
                    Text("Solar Notes", fontSize = 28.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 16.dp))
                }
                items(notes) { note ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color(android.graphics.Color.parseColor(note.color)))
                            .padding(16.dp)
                    ) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.Top) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(note.title, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color.Black)
                                Text(note.date, fontSize = 12.sp, color = Color.DarkGray, modifier = Modifier.padding(vertical = 4.dp))
                                Text(note.content, fontSize = 14.sp, color = Color.Black)
                            }
                            IconButton(onClick = { onDeleteNote(note.id) }) {
                                Icon(Icons.Default.Delete, contentDescription = "Delete Note", tint = Color.Black.copy(alpha = 0.5f))
                            }
                        }
                    }
                }
            }
            IconButton(
                onClick = { isAddingNote = true },
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(24.dp)
                    .size(56.dp)
                    .clip(androidx.compose.foundation.shape.CircleShape)
                    .background(Color(0xFFF59E0B))
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Note", tint = Color.White)
            }
        }
    }
}

@Composable
fun CalculatorApp() {
    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("SolarCalc", fontSize = 24.sp, fontWeight = FontWeight.Bold)
        Text("0", fontSize = 64.sp, modifier = Modifier.padding(vertical = 32.dp))
        // Placeholder for calculator grid
        Text("Calculator grid placeholder", color = Color.Gray)
    }
}

@Composable
fun SettingsApp(solarState: SolarState) {
    Column(modifier = Modifier.fillMaxSize().padding(24.dp)) {
        Text("SolarCore Settings", fontSize = 28.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 24.dp))
        Text("Theme Mode: ${solarState.themeMode}", fontSize = 18.sp, modifier = Modifier.padding(vertical = 8.dp))
        Text("Brightness: ${solarState.brightness}%", fontSize = 18.sp, modifier = Modifier.padding(vertical = 8.dp))
        Text("Volume: ${solarState.volume}%", fontSize = 18.sp, modifier = Modifier.padding(vertical = 8.dp))
    }
}

@Composable
fun GenericApp(app: AppDefinition) {
    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(100.dp)
                .clip(RoundedCornerShape(24.dp))
                .background(Color(android.graphics.Color.parseColor(app.accentColor))),
            contentAlignment = Alignment.Center
        ) {
            Text(app.iconEmoji, fontSize = 50.sp)
        }
        Spacer(modifier = Modifier.height(24.dp))
        Text(app.name, fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Text(app.description, fontSize = 16.sp, color = Color.Gray, textAlign = TextAlign.Center, modifier = Modifier.padding(top = 16.dp))
    }
}
