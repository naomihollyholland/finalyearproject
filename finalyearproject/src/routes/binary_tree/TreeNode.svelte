<script>
    let {x,y} = $props();
</script>

<div class="circle" style="top: {y}px">
    {x}
</div>

<style>
    .circle{
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: blueviolet;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        position:absolute;
        transition: top 1s;
    }
</style>