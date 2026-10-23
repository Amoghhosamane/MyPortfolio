(async () => {
  const tabs = await fetch('http://localhost:9222/json/list').then(r => r.json());
  const target = tabs.find(t => t.url === 'http://localhost:5173/');
  if (!target) return console.log('Target not found');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 6,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          const testCanvas = document.createElement('canvas');
          testCanvas.width = 100;
          testCanvas.height = 100;
          const gl = testCanvas.getContext('webgl2');
          
          const VERTEX = \`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}\`;

          const FRAGMENT = \`#version 300 es
precision highp float;
precision highp int;
out vec4 outColor;
void main() {
  outColor = vec4(0.027, 0.035, 0.055, 1.0);
}\`;

          function compile(type, src) {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
              return { err: gl.getShaderInfoLog(s) };
            }
            return s;
          }

          const v = compile(gl.VERTEX_SHADER, VERTEX);
          const f = compile(gl.FRAGMENT_SHADER, FRAGMENT);
          return { vErr: v.err, fErr: f.err };
        })()`,
        returnByValue: true
      }
    }));
  };

  ws.onmessage = (msg) => {
    console.log('Result:', JSON.stringify(JSON.parse(msg.data), null, 2));
    process.exit(0);
  };
})();
