package com.sunnyui.models

data class AppDefinition(
    val id: String,
    val name: String,
    val category: String,
    val description: String,
    val accentColor: String,
    val iconEmoji: String, // Simplified from gradient for native Android
    val dockEligible: Boolean = false,
    val badge: Int = 0
)

data class NotificationItem(
    val id: String,
    val appId: String,
    val appName: String,
    val title: String,
    val message: String,
    val timeAgo: String,
    val iconEmoji: String,
    val unread: Boolean
)

data class NoteItem(
    val id: String,
    val title: String,
    val content: String,
    val date: String,
    val color: String
)

data class SolarState(
    val sunPosition: Float = 65f, // 0 to 100
    val timeHours: Float = 14.5f,
    val timeOfDay: String = "golden_hour",
    val weatherCondition: String = "Sunny",
    val temperature: Int = 26,
    val uvIndex: Int = 8,
    val solarWattage: Int = 840,
    val solarCharging: Boolean = false,
    val batteryLevel: Int = 86,
    val brightness: Int = 85,
    val volume: Int = 70,
    val wifiEnabled: Boolean = true,
    val bluetoothEnabled: Boolean = true,
    val flashlightEnabled: Boolean = false,
    val themeMode: String = "light", // 'light', 'dark', 'auto'
    val isLocked: Boolean = false
)

object AppsData {
    val APPS = listOf(
        AppDefinition(
            id = "suntrack",
            name = "Weather",
            category = "Solar",
            description = "Live solar radiation, sunrise/sunset arc & UV index meter",
            accentColor = "#0284C7",
            iconEmoji = "☀️",
            dockEligible = true
        ),
        AppDefinition(
            id = "solarbrowser",
            name = "Safari",
            category = "Solar",
            description = "Refractive prismatic web portal with zero glare filter",
            accentColor = "#38BDF8",
            iconEmoji = "🌐",
            dockEligible = true
        ),
        AppDefinition(
            id = "solarbeam",
            name = "Messages",
            category = "Life",
            description = "High-speed messaging through radiant solar optical frequencies",
            badge = 3,
            accentColor = "#16A34A",
            iconEmoji = "💬",
            dockEligible = true
        ),
        AppDefinition(
            id = "solarpulse",
            name = "Music",
            category = "Media",
            description = "Serene acoustic sun-drenched audio synthesizer & music player",
            accentColor = "#FA2D48",
            iconEmoji = "🎵",
            dockEligible = true
        ),
        AppDefinition(
            id = "solarstudio",
            name = "Theme Store",
            category = "Media",
            description = "Community Themes, DIY Maker, AI Theme Generator & Sound Packs",
            badge = 5,
            accentColor = "#F59E0B",
            iconEmoji = "🎨"
        ),
        AppDefinition(
            id = "solarcam",
            name = "Camera",
            category = "Media",
            description = "Cinematic warm lens camera with solar exposure filters",
            accentColor = "#64748B",
            iconEmoji = "📷"
        ),
        AppDefinition(
            id = "solarcore",
            name = "Settings",
            category = "Utilities",
            description = "Glass transparency, sun angle calibration & system settings",
            accentColor = "#64748B",
            iconEmoji = "⚙️"
        ),
        AppDefinition(
            id = "solarcal",
            name = "Calendar",
            category = "Life",
            description = "Daily schedule synchronized with natural golden hours and daylight",
            accentColor = "#EF4444",
            iconEmoji = "📅"
        ),
        AppDefinition(
            id = "solartime",
            name = "Clock",
            category = "Utilities",
            description = "Solar sundial clock, stopwatch and golden hour timer",
            accentColor = "#F59E0B",
            iconEmoji = "⏰"
        ),
        AppDefinition(
            id = "solarnav",
            name = "Maps",
            category = "Utilities",
            description = "Topographic solar shadow mapping & shade-optimized routing",
            accentColor = "#10B981",
            iconEmoji = "🗺️"
        ),
        AppDefinition(
            id = "solarenergy",
            name = "Battery",
            category = "Solar",
            description = "Virtual photovoltaic energy harvesting & battery optimization",
            accentColor = "#10B981",
            iconEmoji = "🔋"
        ),
        AppDefinition(
            id = "solarcalc",
            name = "Calculator",
            category = "Utilities",
            description = "Tactile glass calculator with mechanical haptic clicks",
            accentColor = "#F59E0B",
            iconEmoji = "🧮"
        ),
        AppDefinition(
            id = "solarnotes",
            name = "Notes",
            category = "Life",
            description = "Frosted amber memo cards for daylight thoughts and goals",
            accentColor = "#F59E0B",
            iconEmoji = "📝"
        ),
        AppDefinition(
            id = "solwellness",
            name = "Mindfulness",
            category = "Life",
            description = "Guided resonant breathing attuned to natural sunlight rhythm",
            accentColor = "#EC4899",
            iconEmoji = "🧘"
        ),
        AppDefinition(
            id = "solarvault",
            name = "Photos",
            category = "Utilities",
            description = "Glass encrypted storage for photos, files, and solar logs",
            accentColor = "#06B6D4",
            iconEmoji = "🖼️"
        ),
        AppDefinition(
            id = "solararcade",
            name = "Arcade",
            category = "Media",
            description = "Sunbeam reflex game and solar flare arcade challenges",
            badge = 1,
            accentColor = "#E11D48",
            iconEmoji = "🕹️"
        )
    )

    val INITIAL_NOTIFICATIONS = listOf(
        NotificationItem(
            id = "notif-1",
            appId = "suntrack",
            appName = "SunTrack",
            title = "Golden Hour Approaching",
            message = "Optimal warm sunlight starts in 18 minutes. Camera exposure boost active.",
            timeAgo = "Just now",
            iconEmoji = "☀️",
            unread = true
        ),
        NotificationItem(
            id = "notif-2",
            appId = "solarbeam",
            appName = "Beam Chat",
            title = "Elena Vance",
            message = "Are we still heading to the coastal bluff for sunset photography?",
            timeAgo = "4m ago",
            iconEmoji = "💬",
            unread = true
        ),
        NotificationItem(
            id = "notif-3",
            appId = "solarenergy",
            appName = "Sol Power",
            title = "Solar Harvest +14%",
            message = "Peak 860 W/m² ambient irradiance absorbed. Supercharge mode sustained.",
            timeAgo = "22m ago",
            iconEmoji = "⚡",
            unread = false
        )
    )

    val INITIAL_NOTES = listOf(
        NoteItem(
            id = "note-1",
            title = "Golden Hour Checklist",
            content = "Bring 50mm f/1.4 lens, polarizing glass filter, charge extra battery, find west-facing dunes.",
            date = "Today, 2:40 PM",
            color = "#FEF08A"
        ),
        NoteItem(
            id = "note-2",
            title = "Morning Sun Routine",
            content = "15 min direct sunlight exposure within 30 min of waking. Boosts dopamine and resets circadian clock.",
            date = "Yesterday",
            color = "#FED7AA"
        ),
        NoteItem(
            id = "note-3",
            title = "App Design Vision",
            content = "Sunny UI: 3D glass tactile depth, dynamic refraction, warm amber highlights, and organic physics.",
            date = "Sep 25",
            color = "#BAE6FD"
        )
    )
}
