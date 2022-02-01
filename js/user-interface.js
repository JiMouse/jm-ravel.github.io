$(document).ready(function(){
    //dbirth placeholder
    $("#dbirth").inputmask({
        alias: "datetime", inputFormat: "dd/mm/yyyy", placeholder: "jj/mm/aaaa"
    })

    //initialize panel
    cancer_init();
    children_init();
    siblings_init();
    gpp_init();
    fatherSiblings_init();
    gpm_init();
    motherSiblings_init();

    //To do afterSelectionEnd in disease column : for disease dropdown ? => modal.show based on $('#fh_settings').dialog in main_front.js

    //set variables
    var myDataChildren_new = [];

    // Add hooks to update age and yob
    var setter = false;
    hotCancer.addHook('afterChange',
        function(changes, source) {
            let dbirth = $( "#dbirth" ).val();
            if(dbirth != undefined)
                syncAgeYob(changes, source, 'Age', 'Year', hotCancer, 2, dbirth); //based on dbirth
        }
    );
    //hotChildren
    hotChildren.addHook('afterChange',
        function(changes, source) {
            syncAgeYob(changes, source, 'Age', 'Yob', hotChildren);
        }
    );
    //hotChildren diseases
    hotChildren.addHook('afterChange',
        function(changes, source) {
            syncAgeYob(changes, source, 'Age1', 'Year1', hotChildren);
        }
    );

    // hotSiblings
    hotSiblings.addHook('afterChange',
        function(changes, source) {
            syncAgeYob(changes, source, 'Age', 'Yob', hotSiblings);
        }
    );
    hotSiblings.addHook('afterChange',
    function(changes, source) {
        syncAgeYob(changes, source, 'Age1', 'Year1', hotSiblings);
    }
);

    // hotGpp
    hotGpp.addHook('afterChange',
        function(changes, source) {
            syncAgeYob(changes, source, 'Age', 'Yob', hotGpp);
        }
    );
    hotGpp.addHook('afterChange',
    function(changes, source) {
        syncAgeYob(changes, source, 'Age1', 'Year1', hotGpp);
    }
);

    // hotGpm
    hotGpm.addHook('afterChange',
        function(changes, source) {
            syncAgeYob(changes, source, 'Age', 'Yob', hotGpm);
        }
    );
    hotGpm.addHook('afterChange',
    function(changes, source) {
        syncAgeYob(changes, source, 'Age1', 'Year1', hotGpm);
    }
);

    // hotFatherSiblings
    hotFatherSiblings.addHook('afterChange',
        function(changes, source) {
            syncAgeYob(changes, source, 'Age', 'Yob', hotFatherSiblings);
        }
    );
    hotFatherSiblings.addHook('afterChange',
    function(changes, source) {
        syncAgeYob(changes, source, 'Age1', 'Year1', hotFatherSiblings);
    }
);

    // hotMotherSiblings
    hotMotherSiblings.addHook('afterChange',
        function(changes, source) {
            syncAgeYob(changes, source, 'Age', 'Yob', hotMotherSiblings);
        }
    );
    hotMotherSiblings.addHook('afterChange',
    function(changes, source) {
        syncAgeYob(changes, source, 'Age1', 'Year1', hotMotherSiblings);
    }
);
    //update age and yob
    function syncAgeYob(changes, source, colAge='Age', colYear='Yob', hotTable, deceasedIndex=2, refDate) {
        if(changes != null) {
            col = changes[0][1];
            row = changes[0][0];
            dead = hotTable.getSourceDataAtCell(row, deceasedIndex)
            if((source == 'edit') && (changes.length == 1) && (col == colAge || col == colYear) && (dead != 1)) {
                newValue = changes[0][3];
                if(refDate==undefined) {
                    var today = new Date();
                    var y = today.getFullYear();
                }else{
                    let d = refDate.split('/')[0],
                        m = refDate.split('/')[1],
                        year = refDate.split('/')[2];
                    var refYear=new Date(year, m, d);
                    var y = refYear.getFullYear();
                    if(year==undefined) return;
                }
                if (!setter) {
                    setter = true;
                    let colSync = (col == colAge ? colYear : colAge);
                    let value = (refDate==undefined ? y-newValue : (col == colAge ? newValue+y : newValue-y));
                    hotTable.setDataAtRowProp(row, colSync, value);
                } else {
                    setter = false;
                }
            }
        }
    }

    function cancer_init() {
        $("#cancer_table_div").hide();
        $('input[type=radio][name=cancer_radio]').on('change', function() {
            switch($(this).val()) {
                case 'cancer_Yes':
                    $("#cancer_table_div").show();
                    hotCancer.render();
                    break;

                case 'cancer_No':
                    $("#cancer_table_div").hide();
                    break;
            }
        });
    
        $("#cancer_input").on("blur", function () {
            $("#cancer_table_div").show();
        });
        $("#collapseCancer").click(function () {
            window.setTimeout(()=>{hotCancer.render();});
        });

    }

    function children_init() {
        $("#children_div").hide();
        $("#children_table_div").hide();
    
        $('input[type=radio][name=children_radio]').on('change', function() {
            switch($(this).val()) {
                case 'children_Yes':
                    $("#children_div").show();
                    hotChildren.render()
                    break;

                case 'children_No':
                    $("#children_div").hide();
                    $("#children_table_div").hide();
                    break;
            }
        });
    
        $("#children_input").on("blur", function () {
            var nchild = parseFloat($("#children_input").prop("value"));

            if(!isNaN(nchild)) {
                Indindex = 1;
                IndObj=[];  //reset IndObj
                loadInd(Indindex, nchild, hotChildren.loadData, 'Enfant ');
            }

            $("#children_table_div").show();
            window.setTimeout(()=>{hotChildren.render();});

        });

        $("#collapseChildren").click(function () {
            window.setTimeout(()=>{hotChildren.render();});
        });
    }
    
    function siblings_init() {
        $("#siblings_div").hide();
        $("#siblings_table_div").hide();
    
        $('input[type=radio][name=siblings_radio]').on('change', function() {
            switch($(this).val()) {
                case 'siblings_Yes':
                    $("#siblings_div").show();

                    hotSiblings.render();
                    break;

                case 'siblings_No':
                    $("#siblings_div").hide();
                    $("#siblings_table_div").hide();
                    break;
            }
        });
    
        $("#siblings_input").on("blur", function () {
            var nSiblings = parseFloat($("#siblings_input").prop("value"));
            if(!isNaN(nSiblings)) {
                Indindex = 1;
                IndObj=[];  //reset IndObj
                loadInd(Indindex, nSiblings, hotSiblings.loadData, 'Frère/Sœur ');
            }
            $("#siblings_table_div").show();
            hotSiblings.render();

        });
        $("#collapseSiblings").click(function () {
            window.setTimeout(()=>{hotSiblings.render();});
        });

    }
    
    function gpp_init() {
        $("#collapseGpp").click(function () {
            window.setTimeout(()=>{hotGpp.render();});
            window.setTimeout(()=>{hotFatherSiblings.render();});
        });
    }

    function fatherSiblings_init() {
        $("#fatherSiblings_div").hide();
        $("#fatherSiblings_table_div").hide();
    
        $('input[type=radio][name=fatherSiblings_radio]').on('change', function() {
            switch($(this).val()) {
                case 'fatherSiblings_Yes':
                    $("#fatherSiblings_div").show();
                    hotFatherSiblings.render();
                    break;

                case 'fatherSiblings_No':
                    $("#fatherSiblings_div").hide();
                    $("#fatherSiblings_table_div").hide();
                    break;
            }
        });
    
        $("#fatherSiblings_input").on("blur", function () {
            var nFatherSiblings = parseFloat($("#fatherSiblings_input").prop("value"));
            if(!isNaN(nFatherSiblings)) {
                Indindex = 1;
                IndObj=[];  //reset IndObj
                loadInd(Indindex, nFatherSiblings, hotFatherSiblings.loadData, 'Frère/Sœur du père ');
            }
            $("#fatherSiblings_table_div").show();
            hotFatherSiblings.render();

        });
    }

    function gpm_init() {
        $("#collapseGpm").click(function () {
            window.setTimeout(()=>{hotGpm.render();});
            window.setTimeout(()=>{hotMotherSiblings.render();});
        });
    }

    function motherSiblings_init() {
        $("#motherSiblings_div").hide();
        $("#motherSiblings_table_div").hide();
    
        $('input[type=radio][name=motherSiblings_radio]').on('change', function() {
            switch($(this).val()) {
                case 'motherSiblings_Yes':
                    $("#motherSiblings_div").show();
                    hotMotherSiblings.render();
                    break;

                case 'motherSiblings_No':
                    $("#motherSiblings_div").hide();
                    $("#motherSiblings_table_div").hide();
                    break;
            }
        });
    
        $("#motherSiblings_input").on("blur", function () {
            var nMotherSiblings = parseFloat($("#motherSiblings_input").prop("value"));
            if(!isNaN(nMotherSiblings)) {
                Indindex = 1;
                IndObj=[];  //reset IndObj
                loadInd(Indindex, nMotherSiblings, hotMotherSiblings.loadData, 'Frère/Sœur de la mère ');
            }
            $("#motherSiblings_table_div").show();
            hotMotherSiblings.render();
        });
    }

    //add popup div to select cancer type
    // define variable
    var selectedRow;
    var selectedColumn;
    var dialogCancerList;
    var colDisease;
    var hotSelectedTable;
    var IndDiseaseInput;

    // define cancerList dialog form
    dialogCancerList = $( "#cancerList" ).dialog({
        autoOpen: false,
        classes: {
            "ui-dialog": "custom-background",
            "ui-dialog-titlebar": "custom-theme",
            "ui-dialog-title": "custom-theme text-center",
            "ui-dialog-content": "custom-background",
            "ui-dialog-buttonpane": "custom-background"
        },
        width: ($(window).width() > 400 ? 250 : $(window).width()- 30),
        maxHeight: 700,
        title: 'Localisation du cancer',
    })

    $(".ui-dialog-buttonset .ui-button").addClass('custom-btn');

    $('input[name="cancerListradio"]').on("click", function(e) {
        if(IndDiseaseInput != null && IndDiseaseInput != "") { //if in dialog
            cancerType = $('input[name="cancerListradio"]:checked').val();
            if(cancerType != undefined) {
                $( "#"+IndDiseaseInput ).val(cancerType);
                $('input[name="cancerListradio"]:checked').prop('checked', false);
                IndDiseaseInput = null;
            }
        } else {
            updateDiseasecol(hotSelectedTable, selectedRow, selectedColumn);
        }

        dialogCancerList.dialog( "close" );
    })

    // hotCancer adHook
    hotCancer.addHook('afterSelectionEndByProp',
        function(row, column, preventScrolling) {
            colDisease = "Cancer";
            selectedRow = row;
            selectedColumn = column
            if(selectedColumn == colDisease) {
                hotSelectedTable =  this
                dialogCancerList.dialog( "open" );
            }
            preventScrolling.value = true;
        }
    )

    // hotChildren adHook
    hotChildren.addHook('afterSelectionEndByProp',
        function(row, column, preventScrolling) {
            colDisease = "Disease1";
            selectedRow = row;
            selectedColumn = column
            if(selectedColumn == colDisease) {
                hotSelectedTable =  this
                dialogCancerList.dialog( "open" );
            }
            preventScrolling.value = true;
        }
    )

    
    // showDialogCancerList(hotSiblings, "Disease1");
    hotSiblings.addHook('afterSelectionEndByProp',
        function(row, column, preventScrolling) {
            colDisease = "Disease1";
            selectedRow = row;
            selectedColumn = column
            if(selectedColumn == colDisease) {
                hotSelectedTable =  this
                dialogCancerList.dialog( "open" );
            }
            preventScrolling.value = true;
        }
)

    // showDialogCancerList(hotGpp, "Disease1");
    hotGpp.addHook('afterSelectionEndByProp',
        function(row, column, preventScrolling) {
            colDisease = "Disease1";
            selectedRow = row;
            selectedColumn = column
            if(selectedColumn == colDisease) {
                hotSelectedTable =  this
                dialogCancerList.dialog( "open" );
            }
            preventScrolling.value = true;
        }
    )

    // showDialogCancerList(hotFatherSiblings, "Disease1");
    hotFatherSiblings.addHook('afterSelectionEndByProp',
    function(row, column, preventScrolling) {
        colDisease = "Disease1";
        selectedRow = row;
        selectedColumn = column
        if(selectedColumn == colDisease) {
            hotSelectedTable =  this
            dialogCancerList.dialog( "open" );
        }
        preventScrolling.value = true;
    }
)

    // showDialogCancerList(hotGpm, "Disease1");
    hotGpm.addHook('afterSelectionEndByProp',
    function(row, column, preventScrolling) {
        colDisease = "Disease1";
        selectedRow = row;
        selectedColumn = column
        if(selectedColumn == colDisease) {
            hotSelectedTable =  this
            dialogCancerList.dialog( "open" );
        }
        preventScrolling.value = true;
    }
)

    // showDialogCancerList(hotMotherSiblings, "Disease1");
    hotMotherSiblings.addHook('afterSelectionEndByProp',
    function(row, column, preventScrolling) {
        colDisease = "Disease1";
        selectedRow = row;
        selectedColumn = column
        if(selectedColumn == colDisease) {
            hotSelectedTable =  this
            dialogCancerList.dialog( "open" );
        }
        preventScrolling.value = true;
    }
)

    function updateDiseasecol(hotSelectedTable, row, column) {
        let cancerType = $('input[name="cancerListradio"]:checked').val();
        if(cancerType != undefined) {
            hotSelectedTable.setDataAtRowProp(row, column, cancerType);
            $('input[name="cancerListradio"]:checked').prop('checked', false);
        }
    }

//pop up dialog
    // Set dialog form
    var dialogInd, obj, index;
    dialogInd = $( "#defineInd" ).dialog({
        autoOpen: false,
        classes: {
            "ui-dialog": "custom-background",
            "ui-dialog-titlebar": "custom-theme",
            "ui-dialog-title": "custom-theme text-center",
            // "ui-dialog-titlebar-close":"custom-btn",
            "ui-dialog-content": "custom-background",
            "ui-dialog-buttonpane": "custom-background no-margin"
        },
        width: ($(window).width() > 800 ? 950 : $(window).width()- 30),
        maxHeight: 700,
        modal: true,
        show: { effect: "slideDown", duration: 500 },
        hide: { effect: "slideUp", duration: 300 }
    })
    $(".ui-dialog-buttonset .ui-button").addClass('custom-btn');
    $(".ui-dialog .ui-dialog-buttonpane button").addClass('no-margin-top');
    defineInd_init();

    //Set div hidding function
    function defineInd_init() {
        $("#deathyInd_div").hide();
        $("#IndDisease1").hide();
        $("#IndDisease2").hide();

        //décés
        $('input[type=radio][name=deadStatus]').on('change', function() {
            switch($(this).val()) {
                case '1':
                    $("#deathyInd_div").show();
                    break;

                case '0':
                    $("#deathyInd_div").hide();
                    break;
            }
        });

        // cancer
        $('input[type=radio][name=diseaseStatus]').on('change', function() {
            switch($(this).val()) {
                case '1':
                    $("#IndDisease1").show();
                    $("#IndDisease2").show();
                    break;

                case '0':
                    $("#IndDisease1").hide();
                    $("#IndDisease2").hide();
                    break;
            }
        });

        //load disease dialog when click on cancer input
        $('input[name=IndDisease1Input]').on('click', function() {
            IndDiseaseInput = "IndDisease1Input"
            dialogCancerList.dialog( "open" );
        });
        $('input[name=IndDisease2Input]').on('click', function() {
            IndDiseaseInput = "IndDisease2Input"
            dialogCancerList.dialog( "open" );
        });
        
        //dialog disease
        // 
    }
    
    var IndObj=[];
    var Indindex;
    var nInd;

    loadInd = function(Indindex, nInd, myCallback, label) {
        // set title
        dialogInd.dialog({
            title: label + Indindex
        })
        // set button
        dialogInd.dialog({
            buttons: {
                "Sauvegarder": function() {
                    safeInd(Indindex, nInd, myCallback, label);
                }
            }
        })

        // open dialogInd
        dialogInd.dialog( "open" );
    }

    safeInd = function(Indindex, nInd, myCallback, label) {
        let deadStatus = $('input[name="deadStatus"]:checked').val();
        
        let ind = {
            "FamID": "1",
            "Name": "Enfant"+(Indindex), 
            "Sex": $('input[name="sex"]:checked').val(),
            "Deceased":deadStatus};
        IndObj.push(ind);

        //Age and year of birth
        let yobOrAge = $( "#yobIndInput" ).val();
        var today = new Date();

        if(deadStatus==1) {
            let deathyIndInput = $( "#deathyIndInput" ).val();
            if(yobOrAge<200) {alert("L'année de naissance ne peut être inférieure à 200.")}
            deathyIndInput = (deathyIndInput>200 ? deathyIndInput-yobOrAge: deathyIndInput)
            IndObj[Indindex-1]["Yob"] = yobOrAge;
            IndObj[Indindex-1]["Age"] = deathyIndInput;
        } else {
            if(yobOrAge>200) {
                IndObj[Indindex-1]["Yob"] = yobOrAge;
                IndObj[Indindex-1]["Age"] = today.getFullYear() - yobOrAge;
            } else {
                IndObj[Indindex-1]["Yob"] = today.getFullYear() - yobOrAge;
                IndObj[Indindex-1]["Age"] = yobOrAge;
            };
        };

        //Diseases
        let IndDisease1Input = $( "#IndDisease1Input" ).val();
        let IndDisease1Age = $( "#IndDisease1Age" ).val();
        let IndDisease2Input = $( "#IndDisease2Input" ).val();
        let IndDisease2Age = $( "#IndDisease2Age" ).val();
        
        if(IndDisease1Input!="") IndObj[Indindex-1]["Disease1"] = IndDisease1Input;
        if(IndDisease1Age!="") IndObj[Indindex-1]["Age1"] = IndDisease1Age;
        if(IndDisease2Input!="") IndObj[Indindex-1]["Disease2"] = IndDisease2Input;
        if(IndDisease2Age!="") IndObj[Indindex-1]["Age2"] = IndDisease2Age;

        //Comment
        addKeyToObject(IndObj, Indindex-1, 'comment', 'IndCommentInput')

        // alert(JSON.stringify(IndObj))
        dialogInd.dialog( "close" );
        // alert(label + Indindex + ' sauvegardé');

        // load next form
        if(Indindex < nInd) {
            Indindex+=1;
            document.getElementById("defineInd.frm").reset(); //reset form
            // defineInd_init();
            $("#deathyInd_div").hide();
            $("#IndDisease1").hide();
            $("#IndDisease2").hide();
    
            loadInd(Indindex, nInd, myCallback, label);
        } else {
            myCallback(IndObj);
        }
    }
})