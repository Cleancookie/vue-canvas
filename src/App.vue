<template>
  <div id="app">
    <canvas id="c"></canvas>
    <button @click="getJson">To Json</button>
    <button @click="loadJson">Load Json</button>
    <button @click="loadFromPaths">Load from paths</button>
    <button @click="download">Download</button>
    <br />
    <textarea name="" id="" cols="30" rows="10" v-model="json"></textarea>
    <p>Json size: {{ json.length }}. Number of paths (different from json): {{ paths.length }}</p>
  </div>
</template>

<script>
import { fabric } from 'fabric';
import { compress, decompress } from 'brotli-unicode';

export default {
  name: 'App',
  data() {
    return {
      canvas: null,
      json: '',
      paths: [],
      loadingFromPaths: false
    };
  },
  mounted() {
    this.initCanvas();
  },
  methods: {
    initCanvas() {
      this.canvas = new fabric.Canvas('c', {
        isDrawingMode: true,
        height: 500,
        width: 500,
      });
      let brush = new fabric.PencilBrush(this.canvas);
      brush.width = 5;
      brush.decimate = 10;
      this.canvas.freeDrawingBrush = brush;
      this.canvas.on('path:created', (e) => {
        if (this.loadingFromPaths) {
          return;
        }
        this.getJson();
        const json = JSON.stringify(e.path);
        this.paths.push(json);
      });
    },
    async loadFromPaths() {
      this.loadingFromPaths = true;

      this.canvas.clear();
      let json = JSON.parse(this.json);
      json.objects = [];
      this.paths.forEach((path) => {
        json.objects.push(JSON.parse(path));
      })
      this.json = JSON.stringify(json);
      await this.loadJson();

      this.loadingFromPaths = false;
    },
    async getJson() {
      let json = this.canvas.toJSON();
      this.json = JSON.stringify(json);
    },
    async loadJson() {
      this.canvas.loadFromJSON(this.json);
    },
    async download() {
      let element = document.createElement('a');
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(await compress(this.json))
      );
      element.setAttribute('download', 'canvasState.txt');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
  },
};
</script>

<style>
#c {
  border: 1px solid black;
}
</style>
