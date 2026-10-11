export function reveal(node) {
    const io= new IntersectionObserver((entries) => {
        if(entries.some((e)=> e.isIntersecting)) {
            node.classList.add('in');
            io.disconnect();
        }
    },
    {threshold: 0.2});
    io.observe(node);
    return {
        destroy: ()=>io.disconnect()
    };
}