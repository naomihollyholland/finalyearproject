<script>
    let {i,x,y} = $props();
</script>

<div class="circle" style="top: {y}px; left: {x}px">
    {i}
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
        transition: 1s;
    }
</style>