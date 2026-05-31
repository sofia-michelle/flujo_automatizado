const WEBHOOK_URL = "https://TU_URL_WEBHOOK/webhook/recuperatorio";

const formulario = document.getElementById("formulario");
const resultado = document.getElementById("resultado");

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    resultado.innerHTML = "<p>Procesando solicitud...</p>";

    const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        dni: document.getElementById("dni").value.trim(),
        materia: document.getElementById("materia").value
    };

    try {
        const respuesta = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        //  Verificación: si la respuesta no es JSON válido
        if (!respuesta.ok) {
            throw new Error("Respuesta HTTP no válida: " + respuesta.status);
        }

        const json = await respuesta.json();

        if (json.status === "ok") {
            resultado.innerHTML = `
                <div style="
                    background:#dcfce7;
                    color:#166534;
                    padding:15px;
                    border-radius:10px;
                    border:1px solid #86efac;
                ">
                    <h3>✅ Inscripción Exitosa</h3>
                    <p>${json.mensaje}</p>
                </div>
            `;
        } else if (json.status === "rechazado") {
            resultado.innerHTML = `
                <div style="
                    background:#fee2e2;
                    color:#991b1b;
                    padding:15px;
                    border-radius:10px;
                    border:1px solid #fca5a5;
                ">
                    <h3>❌ Solicitud Rechazada</h3>
                    <p>${json.mensaje}</p>
                </div>
            `;
        } else {
            resultado.innerHTML = `
                <div style="
                    background:#fef3c7;
                    color:#92400e;
                    padding:15px;
                    border-radius:10px;
                    border:1px solid #fcd34d;
                ">
                    <h3>⚠ Atención</h3>
                    <p>${json.mensaje || "Respuesta recibida."}</p>
                </div>
            `;
        }
    } catch (error) {
        resultado.innerHTML = `
            <div style="
                background:#fee2e2;
                color:#991b1b;
                padding:15px;
                border-radius:10px;
                border:1px solid #fca5a5;
            ">
                <h3>❌ Error de Conexión</h3>
                <p>No fue posible comunicarse con el servidor.</p>
            </div>
        `;
        console.error("Error en la solicitud:", error);
    }
});
