<template>
  <div id="app">
    <canvas id="c"></canvas>
    <button @click="getJson">To Json</button>
    <button @click="loadJson">Load Json</button>
    <button @click="download">Download</button>
    <br />
    <textarea name="" id="" cols="30" rows="10" v-model="json"></textarea>
    <p>{{ json.length }}</p>
  </div>
</template>

<script>
import { fabric } from 'fabric';


export default {
  name: 'App',
  data() {
    return {
      canvas: null,
      json: '',
      decompressedJson: '',
      waitingForDecompress: false,
      worker: null,
    };
  },
  mounted() {
    this.canvas = new fabric.Canvas('c', {
      isDrawingMode: true,
      height: 500,
      width: 500,
    });
    let brush = new fabric.PencilBrush(this.canvas);
    brush.width = 5;
    brush.decimate = 10;
    this.canvas.freeDrawingBrush = brush;
    this.canvas.on('path:created', this.getJson);

    this.worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    this.worker.addEventListener(
      'message',
      (e) => {
        if (e.data.type === 'compressed') {
          this.json = e.data.value;
        } else if (e.data.type === 'decompressed') {
          this.decompressedJson = e.data.value;
          this.waitingForDecompress = false;
        }
      }
    );
    this.worker.postMessage({ type: 'test' })
  },
  methods: {
    async getJson() {
      this.worker.postMessage({ type: 'compress', value: JSON.stringify(this.canvas.toJSON()) })
      // let json = this.canvas.toJSON();
    },
    async loadJson() {
      // this.canvas.loadFromJSON(await decompress(this.json));
      this.worker.postMessage({ type: 'decompress', value: this.json })
    },
    download() {
      var element = document.createElement('a');
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(this.json)
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
