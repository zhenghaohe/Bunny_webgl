const mathHelper = {
  createIdentityMat4() {
    let out = new Array(16);
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
  },

  copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  },

  identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  },

  perspective(out, fovy, aspect, near, far) {
    let f = 1.0 / Math.tan(fovy / 2), nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = (2 * far * near) * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  },

  transpose(out, a) {
    if (out === a) {
      let a01 = a[1], a02 = a[2], a03 = a[3];
      let a12 = a[6], a13 = a[7];
      let a23 = a[11];

      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a01;
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a[0];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a[1];
      out[5] = a[5];
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a[2];
      out[9] = a[6];
      out[10] = a[10];
      out[11] = a[14];
      out[12] = a[3];
      out[13] = a[7];
      out[14] = a[11];
      out[15] = a[15];
    }

    return out;
  },

  translate(out, a, v) {
    let x = v[0], y = v[1], z = v[2];
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;

    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
      a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
      a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

      out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
      out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
      out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
  },

  rotate(out, a, rad, axis) {
    let x = axis[0], y = axis[1], z = axis[2];
    let len = Math.sqrt(x * x + y * y + z * z);
    let s, c, t;
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;
    let b00, b01, b02;
    let b10, b11, b12;
    let b20, b21, b22;

    if (len <  0.00001) { return null; }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    return out;
  },

  invert(out, a) {
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
  },

  multiply(out, a, b) {
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
  },

  scale(out, a, v) {
    let x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  },

  calculateNormals(vs, ind) {
    const
      x = 0,
      y = 1,
      z = 2,
      ns = [];

    // For each vertex, initialize normal x, normal y, normal z
    for (let i = 0; i < vs.length; i += 3) {
      ns[i + x] = 0.0;
      ns[i + y] = 0.0;
      ns[i + z] = 0.0;
    }

    // We work on triads of vertices to calculate
    for (let i = 0; i < ind.length; i += 3) {
      // Normals so i = i+3 (i = indices index)
      const v1 = [], v2 = [], normal = [];

      // p2 - p1
      v1[x] = vs[3 * ind[i + 2] + x] - vs[3 * ind[i + 1] + x];
      v1[y] = vs[3 * ind[i + 2] + y] - vs[3 * ind[i + 1] + y];
      v1[z] = vs[3 * ind[i + 2] + z] - vs[3 * ind[i + 1] + z];

      // p0 - p1
      v2[x] = vs[3 * ind[i] + x] - vs[3 * ind[i + 1] + x];
      v2[y] = vs[3 * ind[i] + y] - vs[3 * ind[i + 1] + y];
      v2[z] = vs[3 * ind[i] + z] - vs[3 * ind[i + 1] + z];

      // Cross product by Sarrus Rule
      normal[x] = v1[y] * v2[z] - v1[z] * v2[y];
      normal[y] = v1[z] * v2[x] - v1[x] * v2[z];
      normal[z] = v1[x] * v2[y] - v1[y] * v2[x];

      // Update the normals of that triangle: sum of vectors
      for (let j = 0; j < 3; j++) {
        ns[3 * ind[i + j] + x] = ns[3 * ind[i + j] + x] + normal[x];
        ns[3 * ind[i + j] + y] = ns[3 * ind[i + j] + y] + normal[y];
        ns[3 * ind[i + j] + z] = ns[3 * ind[i + j] + z] + normal[z];
      }
    }

    // Normalize the result.
    // The increment here is because each vertex occurs.
    for (let i = 0; i < vs.length; i += 3) {
      // With an offset of 3 in the array (due to x, y, z contiguous values)
      const nn = [];
      nn[x] = ns[i + x];
      nn[y] = ns[i + y];
      nn[z] = ns[i + z];

      let len = Math.sqrt((nn[x] * nn[x]) + (nn[y] * nn[y]) + (nn[z] * nn[z]));
      if (len === 0) len = 1.0;

      nn[x] = nn[x] / len;
      nn[y] = nn[y] / len;
      nn[z] = nn[z] / len;

      ns[i + x] = nn[x];
      ns[i + y] = nn[y];
      ns[i + z] = nn[z];
    }

    return ns;
  },
};

const canvasHelper = {
  autoResizeCanvas(canvas) {
    const expandFullScreen = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    expandFullScreen();
    // Resize screen when the browser has triggered the resize event
    window.addEventListener('resize', expandFullScreen);
  },

  getShader(gl, id) {
    let shader;
    const script = document.getElementById(id);
    if (!script) {
      return null;
    }
    const shaderString = script.text.trim();
    if (script.type === 'x-shader/x-vertex') {
      shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else if (script.type === 'x-shader/x-fragment') {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else {
      return null;
    }
    gl.shaderSource(shader, shaderString);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  },
};

const controlHelper = {
  keyDown(event) {
    switch(event.key) {
      case 'ArrowUp':
        position = position.map((vertex, index) => index===1 ? vertex+0.1 : vertex);
        break;
      case 'ArrowDown':
        position = position.map((vertex, index) => index===1 ? vertex-0.1 : vertex);
        break;
      case 'ArrowRight':
        position = position.map((vertex, index) => index===0 ? vertex+0.1 : vertex);
        break;
      case 'ArrowLeft':
        position = position.map((vertex, index) => index===0 ? vertex-0.1 : vertex);
        break;
      case '[':
        position = position.map((vertex, index) => index===2 ? vertex+0.1 : vertex);
        break;
      case ']':
        position = position.map((vertex, index) => index===2 ? vertex-0.1 : vertex);
        break;
      case 'r':
        position = BUNNY_HOME_POSITION;
        angleX = 0;
        angleY = 0;
        bunnyRotationRate = 0;
        cubeRotationRate = 0;
        coneRotationRate = 0;
        angleX = 0;
        angleCube = 0;
        angleCone = 0;
        bunnyRotating = false;
        cubeRotating = false;
        coneRotating = false;
        break;
      case 'p':
        if(cubeRotating) {
          cubeRotationRate = 0;
          cubeRotating = false;
        } else {
          cubeRotationRate = 200;
          cubeRotating = true;
        }
        break;
      case 's':
        if(coneRotating) {
          coneRotationRate = 0;
          coneRotating = false;
        } else {
          coneRotationRate = 200;
          coneRotating = true;
        }
        break;
      case 't':
        if(bunnyRotating) {
          bunnyRotationRate = 0;
          bunnyRotating = false;
        } else {
          bunnyRotationRate = 200;
          bunnyRotating = true;
        }
        break;
    }
  },

  onMouseDown(event) {
    dragging = true;
    currentX = event.clientX;
    currentY = event.clientY;
  },

  onMouseMove(event) {
    if(dragging) {
      lastX = currentX;
      lastY = currentY;
      currentX = event.clientX;
      currentY = event.clientY;

      const dx = currentX - lastX;
      const dy = currentY - lastY;

      if(Math.abs(dx)>1) {
        angleX += dx;
      }
      if(Math.abs(dy)>1) {
        angleY += dy;
      }
    }
  },

  onMouseUp() {
    dragging = false;
  },
};

let
  gl,
  program,
  modelViewMatrix = mathHelper.createIdentityMat4(),
  projectionMatrix = mathHelper.createIdentityMat4(),
  normalMatrix = mathHelper.createIdentityMat4(),
  cameraMatrix = mathHelper.createIdentityMat4(),
  bunnyVAO,
  cubeVAO,
  coneVAO,
  bunnyIndices,
  cubeIndices,
  cubeIndicesBuffer,
  coneIndices,
  coneIndicesBuffer,
  bunnyIndicesBuffer,
  cubeModelViewMatrix,
  coneModelViewMatrix,
  lastTime,
  BUNNY_HOME_POSITION = [0, 0, 0],
  CUBE_HOME_POSITION = [5,5,0],
  CONE_HOME_POSITION = [0, 4, 2],
  position = [0, 0, 0],
  currentX,
  currentY,
  lastX,
  lastY,
  dragging,
  angleX = 0,
  angleY = 0,
  angleCube = 0,
  angleCone = 0,
  flag = true,
  bunnyRotationRate = 0,
  cubeRotationRate = 0,
  coneRotationRate = 0,
  bunnyRotating = false,
  cubeRotating = false,
  coneRotating = false,
  shininess = 5,
  clearColor = [0.9, 0.9, 0.9],
  lightColor = [0.98, 0.88, 0.18, 1],
  lightAmbient = [0.13, 0.13, 0.13, 1],
  lightSpecular = [0.64, 0.64, 0.64, 1],
  lightDirection = [-0.25, -0.25, -0.25],
  materialDiffuse = [0.92, 0.90, 0.64, 1],
  materialAmbient = [1, 1, 1, 1],
  materialSpecular = [0.88, 0.88, 0.88, 1];


function initProgram() {
  const canvas = document.getElementById('canvas');
  canvasHelper.autoResizeCanvas(canvas);

  gl = canvas.getContext('webgl2');
  gl.clearColor(...clearColor, 1);
  gl.clearDepth(100);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  // Shader source
  const vertexShader = canvasHelper.getShader(gl, 'vertex-shader');
  const fragmentShader = canvasHelper.getShader(gl, 'fragment-shader');

  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Could not initialize shaders');
  }

  gl.useProgram(program);

  program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  program.aVertexNormal = gl.getAttribLocation(program, 'aVertexNormal');
  program.uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
  program.uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
  program.uNormalMatrix = gl.getUniformLocation(program, 'uNormalMatrix');
  program.uMaterialAmbient = gl.getUniformLocation(program, 'uMaterialAmbient');
  program.uMaterialDiffuse = gl.getUniformLocation(program, 'uMaterialDiffuse');
  program.uMaterialSpecular = gl.getUniformLocation(program, 'uMaterialSpecular');
  program.uShininess = gl.getUniformLocation(program, 'uShininess');
  program.uLightAmbient = gl.getUniformLocation(program, 'uLightAmbient');
  program.uLightDiffuse = gl.getUniformLocation(program, 'uLightDiffuse');
  program.uLightSpecular = gl.getUniformLocation(program, 'uLightSpecular');
  program.uLightDirection = gl.getUniformLocation(program, 'uLightDirection');

  document.addEventListener('keydown', event => controlHelper.keyDown(event), false);
  canvas.onmousedown = event => controlHelper.onMouseDown(event);
  canvas.onmouseup = event => controlHelper.onMouseUp(event);
  canvas.onmousemove = event => controlHelper.onMouseMove(event);
}

function initLights() {
  gl.uniform4fv(program.uLightDiffuse, lightColor);
  gl.uniform4fv(program.uLightAmbient, lightAmbient);
  gl.uniform4fv(program.uLightSpecular, lightSpecular);
  gl.uniform3fv(program.uLightDirection, lightDirection);
  gl.uniform4fv(program.uMaterialDiffuse, materialDiffuse);
  gl.uniform4fv(program.uMaterialAmbient, materialAmbient);
  gl.uniform4fv(program.uMaterialSpecular, materialSpecular);
  gl.uniform1f(program.uShininess, shininess);
}

function vec3()
  {
    return [...arguments];
  }

function initBuffers() {
  // Bunny
  const bunnyVertices = get_vertices().flat(Infinity);
  bunnyIndices = get_faces().flat(Infinity).map(n => n-1);
  const normals = mathHelper.calculateNormals(bunnyVertices, bunnyIndices);
  
  bunnyVAO = gl.createVertexArray();
  cubeVAO = gl.createVertexArray();
  coneVAO = gl.createVertexArray();
  gl.bindVertexArray(bunnyVAO);

  // Vertices
  const bunnyVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bunnyVerticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bunnyVertices), gl.STATIC_DRAW);
  // Configure VAO instructions
  gl.enableVertexAttribArray(program.aVertexPosition);
  gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

  // Normals
  const bunnyNormalsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bunnyNormalsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  // Configure VAO instructions
  gl.enableVertexAttribArray(program.aVertexNormal);
  gl.vertexAttribPointer(program.aVertexNormal, 3, gl.FLOAT, false, 0, 0);

  // Indices
  bunnyIndicesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bunnyIndicesBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bunnyIndices), gl.STATIC_DRAW);

  // Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  // Cube
  const cubeVertices = [0.25, 0.25, -1.75, 0.25, 0.75, -1.75, 0.75, 0.25, -1.75, 0.75, 0.75, -1.75, 0.25, 0.25, -2.25, 0.25, 0.75, -2.25, 0.75, 0.25, -2.25, 0.75, 0.75, -2.25];
  cubeIndices = [0, 1, 1, 3, 3, 2, 2, 0, 4, 6, 6, 7, 7, 5, 5, 4, 1,5 , 0, 4, 2, 6, 3, 7];

  gl.bindVertexArray(cubeVAO);

  // Vertices
  const cubeVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.aVertexPosition);
  gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

  // Indices
  cubeIndicesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndicesBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  // Cone
  const coneVertices = [1.5, 0, 0, -1.5, 1, 0, -1.5, 0.809017, 0.587785, -1.5, 0.309017, 0.951057, -1.5, -0.309017, 0.951057, -1.5, -0.809017, 0.587785, -1.5, -1, 0, -1.5, -0.809017, -0.587785, -1.5, -0.309017, -0.951057, -1.5, 0.309017, -0.951057, -1.5, 0.809017, -0.587785];
  coneIndices =  [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 7, 0, 7, 8, 0, 8, 9, 0, 9, 10, 0, 10, 1];

  gl.bindVertexArray(coneVAO);

  const coneVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, coneVerticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coneVertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.aVertexPosition);
  gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

  coneIndicesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coneIndicesBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(coneIndices), gl.STATIC_DRAW);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function draw() {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mathHelper.perspective(projectionMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 10000);
  mathHelper.identity(modelViewMatrix);
  mathHelper.identity(cameraMatrix);

  mathHelper.translate(modelViewMatrix, modelViewMatrix, position);
  mathHelper.translate(cameraMatrix, cameraMatrix, [0, 0, 10]);
  mathHelper.invert(cameraMatrix,cameraMatrix);

  mathHelper.multiply(modelViewMatrix, modelViewMatrix, cameraMatrix);

  mathHelper.rotate(modelViewMatrix, modelViewMatrix, angleX * Math.PI / 180, [0,1,0]);
  mathHelper.rotate(modelViewMatrix, modelViewMatrix, angleY * Math.PI / 180, [1,0,0]);


  mathHelper.copy(normalMatrix, modelViewMatrix);
  mathHelper.invert(normalMatrix, normalMatrix);
  mathHelper.transpose(normalMatrix, normalMatrix);

  gl.uniformMatrix4fv(program.uNormalMatrix, false, normalMatrix);
  gl.uniformMatrix4fv(program.uModelViewMatrix, false, modelViewMatrix);
  gl.uniformMatrix4fv(program.uProjectionMatrix, false, projectionMatrix);

  try {
    // draw bunny
    gl.bindVertexArray(bunnyVAO);
    gl.drawElements(gl.TRIANGLES, bunnyIndices.length, gl.UNSIGNED_SHORT,0);

    // draw cube
    gl.bindVertexArray(cubeVAO);

    cubeModelViewMatrix = mathHelper.identity(mathHelper.createIdentityMat4());
    mathHelper.rotate(cubeModelViewMatrix, cubeModelViewMatrix, angleCube * Math.PI / 180, [0,1,0]);
    mathHelper.translate(cubeModelViewMatrix, cubeModelViewMatrix, CUBE_HOME_POSITION);
    mathHelper.multiply(cubeModelViewMatrix, cubeModelViewMatrix, cameraMatrix);

    gl.uniform3fv(program.uLightDirection, [
      -cubeModelViewMatrix[12],
      -cubeModelViewMatrix[13],
      cubeModelViewMatrix[14]>0 ? cubeModelViewMatrix[14]/20 : cubeModelViewMatrix[14],
    ]);

    gl.uniformMatrix4fv(program.uModelViewMatrix, false, cubeModelViewMatrix);

    gl.drawElements(gl.LINES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

    // draw cone
    gl.bindVertexArray(coneVAO);
    coneModelViewMatrix = mathHelper.identity(mathHelper.createIdentityMat4());

    mathHelper.translate(coneModelViewMatrix, coneModelViewMatrix, CONE_HOME_POSITION);
    mathHelper.rotate(coneModelViewMatrix, coneModelViewMatrix, 90 * Math.PI / 180, [0, 0, 1]);
    mathHelper.multiply(coneModelViewMatrix, coneModelViewMatrix, cameraMatrix);
    mathHelper.scale(coneModelViewMatrix ,coneModelViewMatrix, [0.2,0.2,0.2]);

    mathHelper.rotate(coneModelViewMatrix, coneModelViewMatrix, angleCone * Math.PI / 180, [0, 0, 1]);

    gl.uniformMatrix4fv(program.uModelViewMatrix, false, coneModelViewMatrix);

    gl.drawElements(gl.LINE_LOOP, coneIndices.length, gl.UNSIGNED_SHORT, 0);
  }

  catch (error) {
    console.error(error);
  }
}

function animate() {
  let timeNow = new Date().getTime();
  if (lastTime) {
    const elapsed = timeNow - lastTime;
    angleX += (bunnyRotationRate * elapsed) / 10000.0;
    angleCube += (cubeRotationRate * elapsed) / 10000.0;
    if(flag) {
      angleCone += (coneRotationRate * elapsed) / 10000.0;
      if(angleCone > 35) {
        flag = false;
      }
    } else {
      angleCone -= (coneRotationRate * elapsed) / 10000.0;
      if(angleCone < -35) {
        flag = true;
      }
    }
  }
  lastTime = timeNow;
}

function render() {
  requestAnimationFrame(render);
  animate();
  draw();
}

function init() {
  initProgram();
  initBuffers();
  initLights();
  render();
}

window.onload = init;