const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// --- 1. MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. ARCHIVOS ESTÁTICOS ---
app.use(express.static(path.join(__dirname, 'src', 'assets')));

// --- 3. SUPABASE ---
const supabase = createClient(
    process.env.SUPABASE_URL || 'https://tqjoaltfbzicbqjfomfk.supabase.co',
    process.env.SUPABASE_KEY || 'sb_publishable_hhFREJKTApyObsBT1HPRXg_iizVxL9N'
);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.warn('⚠️ Variables de entorno de Supabase no configuradas');
} else {
    console.log('✅ Supabase conectado');
}

// --- 4. RUTAS HTML ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'dashboard', 'admin.html'));
});

app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'dashboard', 'form.html'));
});

app.get('/listado', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'dashboard', 'listado.html'));
});
app.get('/estudiante', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'dashboard', 'estudiante.html'));
});
app.get('/json', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'dashboard', 'json.html'));
});

// --- 5. API CRUD SUPABASE ---

// 🔹 LISTAR
app.get('/api/proveedor', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('proveedor')
            .select('*')
            .order('id_proveedor', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error('Error LISTAR:', err);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

// 🔹 OBTENER UNO
app.get('/api/proveedor/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('proveedor')
            .select('*')
            .eq('id_proveedor', id)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        res.json(data);
    } catch (err) {
        console.error('Error OBTENER:', err);
        res.status(500).json({ error: 'Error interno' });
    }
});

// 🔹 CREAR
app.post('/api/proveedor', async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre || !descripcion) {
            return res.status(400).json({ error: 'Campos incompletos' });
        }

        const { data, error } = await supabase
            .from('proveedor')
            .insert([{ nombre, descripcion }])
            .select();

        if (error) throw error;

        res.status(201).json({
            mensaje: 'Proveedor creado',
            data
        });
    } catch (err) {
        console.error('Error CREAR:', err);
        res.status(500).json({ error: 'Error al insertar' });
    }
});

// 🔹 EDITAR
app.put('/api/proveedor/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        if (!nombre || !descripcion) {
            return res.status(400).json({ error: 'Campos incompletos' });
        }

        const { data, error } = await supabase
            .from('proveedor')
            .update({ nombre, descripcion })
            .eq('id_proveedor', id)
            .select();

        if (error) throw error;

        res.json({
            mensaje: 'Actualizado correctamente',
            data
        });
    } catch (err) {
        console.error('Error EDITAR:', err);
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

// 🔹 ELIMINAR
app.delete('/api/proveedor/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('proveedor')
            .delete()
            .eq('id_proveedor', id);

        if (error) throw error;

        res.json({ mensaje: 'Eliminado correctamente' });
    } catch (err) {
        console.error('Error ELIMINAR:', err);
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

// --- 6. FALLBACK (IMPORTANTE PARA SPA) ---
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'dashboard', 'admin.html'));
});

// --- 7. SERVIDOR ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});