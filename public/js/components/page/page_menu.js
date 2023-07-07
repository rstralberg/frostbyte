
function page_menu(pages) {

    var pages_array = new Array();
    for (let i = 0; i < pages.length; i++) {
        let page = pages[i];
        if (page.parent > -1) {
            var item = null;
            if (page.parent === 0) {
                item = {
                    value: page.id,
                    text: page.title,
                    listener: on_click
                };
                pages_array.push(item);

                for (let j = 0; j < pages.length; j++) {
                    let p = pages[j];
                    if (p.parent === page.id) {
                        if (!is_valid(item.items)) {
                            item.items = new Array();
                        }
                        item.items.push({
                            value: p.id,
                            text: p.title,
                            listener: on_click
                        });
                    }
                }
            }
        }
    }
    create_form(Page.FORM_MENU,
        {
            title: 'Meny',
            cancel: false ,
            fixed: true,
            css: ['iform', 'page-menu']
        }, [
        {
            type: FormType.TextArea,
            name: 'desc',
            value: 'Välj sida med undersidor där ordningen ska ändras',
            rows: 2,
            cols: 30
        },
        {
            type: FormType.Tree,
            name: Page.FORM_MENU_TREE,
            items: pages_array,
            width: 'inherit',
        }
    ]);

    function on_click(e) {

        var src = e;
        console.log('src ' + src.value + ' ' + src.text);
        
        let targets = new Array();
        pages.forEach(page => {
            if (parseInt(page.id) !== parseInt(e.value)) {
                targets.push({
                    value: page.id,
                    text: page.title + ' (' + page.id + ')',
                });
            }
        });

        create_form(Page.FORM_MENU_ACTION, {
            title: 'Välj vart du vill flytta',
            action: 'Flytta',
            pos: { x: '55vw', y: '8vh' },
            zindex: 9999
        }, [
            {
                type: FormType.List,
                name: 'targets',
                items: targets,
                required: true
            },
            {
                type: FormType.List,
                name: 'dest',
                items: [
                    { value: 'above', text: 'Ovanför' },

                    { value: 'inside', text: 'Inuti' },
                    { value: 'below', text: 'Nedaför' },
                ],
                required: true,
            }
        ])
            .then((result) => {


                let target_id = parseInt( result.get('targets'));
                let source_id = parseInt( e.value);
                console.log( 'Src id=' + source_id);
                console.log( 'Dest id=' + target_id);
                
                let source_parent = -1;
                let source=-1;
                let target_parent = -1;
                let target=-1;
                let tree = document.getElementById('page-tree');
                for( let i = 0; i <tree.childElementCount ; i++) {

                    let item = tree.children[i];
                    if( parseInt(item.value) === source_id ) {
                        source = i;
                    } else if ( parseInt(item.value) === target_id ) {
                        target = i;
                    }
                    
                    if( (source===-1 || target === -1) && item.childElementCount > 0 ) {

                        let ul = item.querySelector('ul');
                        for( let j=0; j < ul.childElementCount; j++ ) {
                            let subitem = ul.children[j];
                            if( parseInt(subitem.value) === source_id ) {
                                source_parent = i;
                                source = j;
                            } else if ( parseInt(subitem.value) === target_id ) {
                                target_parent = i;
                                target = j;
                            }
                        }
                    }
                }

                console.log( 'Source id=' + source_id + ' is at ' + source_parent + '/' + source);
                console.log( 'Target id=' + target_id + ' is at ' + target_parent + '/' + target);

                switch(result.get('dest')) {
                    case 'above': move_above(); break;
                    case 'inside': move_inside(); break;
                    case 'below': move_below(); break;
                }

                function move_above() {
                    let from = null;
                    if( source_parent != -1 ) {
                        from = tree.children[source_parent].children[0].children[source];
                    } else {
                        from = tree.children[source];
                    }
                    
                    let to = null;
                    if( target_parent != -1 ) {
                        to = tree.children[target_parent].children[0].children[target];
                    } else {
                        to = tree.children[target];
                    }

                }

                function move_inside() {
                    let from = null;
                    if( source_parent != -1 ) {
                        from = tree.children[source_parent].children[0].children[source];
                    } else {
                        from = tree.children[source];
                    }
                    
                    let to = null;
                    if( target_parent != -1 ) {
                        to = tree.children[target_parent].children[0].children[target];
                    } else {
                        to = tree.children[target];
                    }
                    
                }

                function move_below() {
                    let from = null;
                    if( source_parent != -1 ) {
                        from = tree.children[source_parent].children[0].children[source];
                    } else {
                        from = tree.children[source];
                    }
                    
                    let to = null;
                    if( target_parent != -1 ) {
                        to = tree.children[target_parent].children[0].children[target];
                    } else {
                        to = tree.children[target];
                    }
                   
                }
            });

                
                // for (let i = 0; i < pages_array.length; i++) {
                //     let page = pages_array[i];
                    
                //     if (parseInt(page.value) === target) {
                        

                //         switch (dest) {
                //             case 'above':
                //                 break;
                //             case 'inside': break;
                //             case 'below': break;
                //         }
                //     }
                // }

    }
}


function is_in_menu(id) {

    let tree = document.getElementById(Page.FORM_MENU_TREE);
    for( let i=0; i < tree.childElementCount; i++) {
        let item = tree.children[i];
        if( parseInt(item.value) === id ) {
            return true;
        }
        if( item.childElementCount > 0 ) {
            let ul = item.querySelector('ul');
            if( is_valid(ul) && ul.childElementCount > 0) {
                for( let j=0; j < ul.childElementCount; j++ ) {
                    let sub = ul.children[j];
                    if( parseInt(sub.value) === id ) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

