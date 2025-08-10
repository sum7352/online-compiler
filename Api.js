const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const compiler = require("compilex");

const app = express();
compiler.init({ stats: true });

app.use(bodyParser.json());
app.use('/codemirror', express.static(path.join(__dirname, 'codemirror')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post("/compile", function (req, res) {
    const code = req.body.code;
    const input = req.body.input;
    const language = req.body.lang;

    try {
        if (language === "cpp") {
            const envData = { OS: "windows", cmd: "g++",options:{timeout:10000} };
            if (!input) {
                compiler.compileCPP(envData, code, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            } else {
                compiler.compileCPPWithInput(envData, code, input, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            }
        } else if (language === "java") {
            const envData = { OS: "windows" };
            if (!input) {
                compiler.compileJava(envData, code, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            } else {
                compiler.compileJavaWithInput(envData, code, input, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            }
        } else if (language === "python") {
            const envData = { OS: "windows" };
            if (!input) {
                compiler.compilePython(envData, code, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            } else {
                compiler.compilePythonWithInput(envData, code, input, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            }
        } else {
            res.status(400).send({ output: "Unsupported language" });
        }
    } catch (e) {
        console.error("Compile error:", e);
        res.status(500).send({ output: "Internal server error" });
    }
});

app.listen(8000, () => {
    console.log('✅ Server is running on http://localhost:8000');
});
