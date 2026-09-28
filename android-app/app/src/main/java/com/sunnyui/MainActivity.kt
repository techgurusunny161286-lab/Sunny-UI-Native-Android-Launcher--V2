package com.sunnyui

import android.app.role.RoleManager
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.view.WindowManager
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.sunnyui.models.NativeApp
import com.sunnyui.models.NativeAppsRepository
import com.sunnyui.models.SolarState
import com.sunnyui.models.NotesRepository
import com.sunnyui.ui.*
import com.sunnyui.ui.apps.SimulatedAppWindow
import com.sunnyui.ui.theme.SunnyUITheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
        setContent { SunnyUITheme { NativeLauncherScreen() } }
    }

    override fun onResume() {
        super.onResume()
        // Launcher UI reloads app list when returning from Settings/Home-role chooser.
    }

    fun requestDefaultLauncher() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val roleManager = getSystemService(RoleManager::class.java)
            if (roleManager != null && roleManager.isRoleAvailable(RoleManager.ROLE_HOME) && !roleManager.isRoleHeld(RoleManager.ROLE_HOME)) {
                startActivityForResult(roleManager.createRequestRoleIntent(RoleManager.ROLE_HOME), 1001)
            }
        } else {
            startActivity(Intent(Settings.ACTION_HOME_SETTINGS))
        }
    }
}

@Composable
fun NativeLauncherScreen() {
    val context = LocalContext.current
    val activity = context as? MainActivity
    var apps by remember { mutableStateOf(emptyList<NativeApp>()) }
    var drawer by remember { mutableStateOf(false) }
    var controlCenter by remember { mutableStateOf(false) }
    var activeSimulatedApp by remember { mutableStateOf<com.sunnyui.models.AppDefinition?>(null) }
    var solarState by remember { mutableStateOf(SolarState()) }
    val notesRepository = remember { NotesRepository(context) }
    val notes by notesRepository.notes.collectAsState()

    LaunchedEffect(Unit) { apps = NativeAppsRepository.load(context) }
    val favorites = apps.take(4)

    Box(Modifier.fillMaxSize().background(Color(0xFFF6B73C))) {
        Column(Modifier.fillMaxSize()) {
            StatusBar(
                solarState = solarState,
                onOpenNotifications = { drawer = true },
                onOpenControlCenter = { controlCenter = true }
            )
            Box(Modifier.weight(1f)) {
                NativeHomeScreen(
                    apps = apps,
                    onLaunchApp = { app -> context.startActivity(app.launchIntent()) },
                    onOpenDrawer = { drawer = true },
                    onSetDefault = { activity?.requestDefaultLauncher() }
                )
            }
            GlassNativeDock(favorites) { app -> context.startActivity(app.launchIntent()) }
            GestureBar(onGoHome = { drawer = false; controlCenter = false })
        }

        AnimatedVisibility(drawer, enter = fadeIn(), exit = fadeOut()) {
            NativeAppDrawer(
                apps = apps,
                onClose = { drawer = false },
                onLaunchApp = { app -> drawer = false; context.startActivity(app.launchIntent()) }
            )
        }

        AnimatedVisibility(controlCenter, enter = fadeIn(), exit = fadeOut()) {
            ControlCenter(
                solarState = solarState,
                onClose = { controlCenter = false },
                onUpdateBrightness = { solarState = solarState.copy(brightness = it) },
                onUpdateVolume = { solarState = solarState.copy(volume = it) },
                onToggleWifi = { solarState = solarState.copy(wifiEnabled = !solarState.wifiEnabled) },
                onToggleBluetooth = { solarState = solarState.copy(bluetoothEnabled = !solarState.bluetoothEnabled) },
                onToggleFlashlight = { solarState = solarState.copy(flashlightEnabled = !solarState.flashlightEnabled) }
            )
        }

        // Keep the original Sunny UI simulated apps available as a design playground.
        if (activeSimulatedApp != null) {
            SimulatedAppWindow(
                app = activeSimulatedApp!!,
                solarState = solarState,
                notes = notes,
                onAddNote = { title, content -> notesRepository.addNote(title, content) },
                onDeleteNote = { notesRepository.deleteNote(it) }
            )
        }
    }
}
