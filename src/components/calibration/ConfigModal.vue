<template>
    <v-dialog v-model="aDialog" max-width="600px" max-height="500px">
        <v-card>
            <v-card-title class="headline text-center mx-auto">recalibrate</v-card-title>
            <v-card-text>
                {{ (mockPattern.length != 0) ? `using ${mockPattern.length} selected points` : `no points selected, using
                all ${pattern.length} points` }}
            </v-card-text>
            <Slider :value="threshold" :min="Number(0)" :step="5" :max="Number(1000)" label="Points Distance Threshold"
                @input="updateThreshold" />
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" :disabled="fromDashboard" text @click="recalibrate">recalib</v-btn>
                <v-btn color="blue darken-1" :disabled="fromDashboard" text @click="save">save</v-btn>
                <v-btn color="blue darken-1" text @click="aDialog = false">close</v-btn>
                <!-- <v-btn color="blue darken-1" text @click="runInferenceX">run inference X</v-btn> -->
                <v-btn color="blue darken-1" text @click="runInference">run inference Y</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
  

<script>
import Slider from '@/components/general/Slider.vue'
import * as onnx from 'onnxjs';

export default {
    components: {
        Slider
    },
    props: {
        configDialog: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            aDialog: false
        }
    },
    watch: {
        configDialog(newDialog) {
            this.aDialog = newDialog
        },
        aDialog(newAdialog) {
            this.$emit('close', newAdialog);
        }
    },
    computed: {
        threshold() {
            return this.$store.state.calibration.threshold;
        },
        pattern() {
            return this.$store.state.calibration.pattern
        },
        mockPattern() {
            return this.$store.state.calibration.mockPattern
        },
        fromDashboard() {
            return this.$store.state.calibration.fromDashboard
        },
    },
    methods: {
        async runInference() {
            const sessionX = new onnx.InferenceSession();
            await sessionX.loadModel("https://firebasestorage.googleapis.com/v0/b/web-eye-tracker-front.appspot.com/o/modelx.onnx?alt=media&token=9706011c-2571-4c13-8233-a920f03bbd0c");

            const sessionY = new onnx.InferenceSession();
            await sessionY.loadModel("https://firebasestorage.googleapis.com/v0/b/web-eye-tracker-front.appspot.com/o/modely.onnx?alt=media&token=bf8509cf-87c5-438a-8e38-3f73c197b744");
            for (let i = 0; i < 10; i++) {
                // Prepare input data (replace with your actual input)
                const rightEyeX = Math.random() * 0.5 + 0.25;
                const rightEyeY = Math.random() * 0.5 + 0.25;
                const inputDataX = new Float64Array([rightEyeX, rightEyeY])

                // Run model with Tensor inputs and get the result by output name defined in model
                const outputMapX = await sessionX.run([new onnx.Tensor(inputDataX, 'float64', [1, 2])]);
                const outputDataX = outputMapX.values().next().value.data;

                // Prepare input data (replace with your actual input)
                const leftEyeX = Math.random() * 0.5 + 0.25;
                const leftEyeY = Math.random() * 0.5 + 0.25;
                const inputDataY = new Float64Array([leftEyeX, leftEyeY])

                // Run model with Tensor inputs and get the result by output name defined in model
                const outputMapY = await sessionY.run([new onnx.Tensor(inputDataY, 'float64', [1, 2])]);
                const outputDataY = outputMapY.values().next().value.data;

                this.$store.commit('setPredictions', { pointX: outputDataX[0], pointY: outputDataY[0] });
            }
        },
        async runInferenceX() {
            // Load the ONNX model
            const session = new onnx.InferenceSession();
            await session.loadModel("https://firebasestorage.googleapis.com/v0/b/web-eye-tracker-front.appspot.com/o/modelx.onnx?alt=media&token=9706011c-2571-4c13-8233-a920f03bbd0c");

            // Prepare input data (replace with your actual input)
            const inputData = new Float64Array([0.40, 0.30])

            // Run model with Tensor inputs and get the result by output name defined in model
            const outputMap = await session.run([new onnx.Tensor(inputData, 'float64', [1, 2])]);
            const outputData = outputMap.values().next().value.data;
            console.log(outputData);
        },
        async runInferenceY() {
            // Load the ONNX model
            const session = new onnx.InferenceSession();
            await session.loadModel("https://firebasestorage.googleapis.com/v0/b/web-eye-tracker-front.appspot.com/o/modely.onnx?alt=media&token=bf8509cf-87c5-438a-8e38-3f73c197b744");

            // Prepare input data (replace with your actual input)
            const inputData = new Float64Array([0.40, 0.30])

            // Run model with Tensor inputs and get the result by output name defined in model
            const outputMap = await session.run([new onnx.Tensor(inputData, 'float64', [1, 2])]);
            const outputData = outputMap.values().next().value.data;
            console.log(outputData);
        },
        updateThreshold(value) {
            this.$store.commit('setThreshold', value);
        },
        recalibrate() {
            this.$emit('recalib');
        },
        save() {
            this.$emit('save');
        }
    }
}
</script>