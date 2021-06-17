<div class="root">
    <canvas id="main-view"></canvas>
</div>

<script>
    import {onMount} from 'svelte';
    import App from "./scene/App";

    let app = null

    onMount(async () => {
        app = new App();

    })


</script>

<style global>
    .root {
        background-color: aquamarine;
        width: 100vw;
        height: 100vh;


    }

    #main-view {
        background-color: antiquewhite;
        width: 100%;
        height: 100%;

    }


</style>