package com.sunnyui.models

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.UUID
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class NotesRepository(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("sunny_notes", Context.MODE_PRIVATE)
    private val gson = Gson()

    private val _notes = MutableStateFlow<List<NoteItem>>(emptyList())
    val notes: StateFlow<List<NoteItem>> = _notes.asStateFlow()

    init {
        loadNotes()
    }

    private fun loadNotes() {
        val notesJson = prefs.getString("notes_list", null)
        if (notesJson != null) {
            val type = object : TypeToken<List<NoteItem>>() {}.type
            _notes.value = gson.fromJson(notesJson, type)
        } else {
            // First time load, use initial notes
            _notes.value = AppsData.INITIAL_NOTES
            saveNotes(_notes.value)
        }
    }

    private fun saveNotes(notesList: List<NoteItem>) {
        val json = gson.toJson(notesList)
        prefs.edit().putString("notes_list", json).apply()
        _notes.value = notesList
    }

    fun addNote(title: String, content: String) {
        val currentList = _notes.value.toMutableList()
        val colors = listOf("#FEF08A", "#FED7AA", "#BAE6FD", "#A7F3D0", "#FECACA")
        val randomColor = colors.random()

        val newNote = NoteItem(
            id = UUID.randomUUID().toString(),
            title = title,
            content = content,
            date = SimpleDateFormat("MMM dd, h:mm a", Locale.getDefault()).format(Date()),
            color = randomColor
        )
        currentList.add(0, newNote)
        saveNotes(currentList)
    }

    fun deleteNote(id: String) {
        val currentList = _notes.value.toMutableList()
        currentList.removeAll { it.id == id }
        saveNotes(currentList)
    }
}
