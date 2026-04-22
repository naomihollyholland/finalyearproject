<script>
    let {id, value ,x,y} = $props();
</script>

<div class="circle" style="top: {y}px; left: {x}px">
    <div class="id">
    ID: {id}
    </div>
    <div class="value">
    {value}
    </div>
</div>


<style>

    
    .circle{
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: #2e343b;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        position:absolute;
        transition: 1s;
        flex-direction: column;
    }

    .id{
        height: 30%;

        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }

     .value{

        height: 50%;
        flex-direction: row;
        flex-wrap: wrap;

    }



</style>