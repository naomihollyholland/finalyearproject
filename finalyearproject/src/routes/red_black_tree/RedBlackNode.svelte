<script>
    let {id, value ,x,y, isred} = $props();
</script>

{#if isred}
    <div class="redcircle" style="top: {y}px; left: {x}px">
        <div class="id">
            ID: {id}
        </div>
        <div class="value">
            {value}
        </div>
    </div>
{:else}
    <div class="blackcircle" style="top: {y}px; left: {x}px">
        <div class="id">
            ID: {id}
        </div>
        <div class="value">
            {value}
        </div>
    </div>
{/if} 



<style>

    
    .blackcircle{
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: black;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        position:absolute;
        transition: 1s;
        flex-direction: column;
    }
        
    .redcircle{
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: red;
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