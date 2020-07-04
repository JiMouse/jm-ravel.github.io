//Create JSON dictionnary
var dico = {
    'pronom':{
        'M':'Il',
        'F':'Elle',
        'MM':'Ils',
        'Mmes':'Elles'
    },
    'pronom2':{
        'M':'Son',
        'F':'Sa'
    },
    'civil':{
        'M':'Monsieur',
        'F':'Madame',
        'MM':'Messieurs',
        'Mmes':'Mesdames'
    },
    'naissance':{
        'M':'né',
        'F':'née',
        'MM':'nés',
        'Mmes':'nées'
    },
    'décés':{
        'M':'décédé',
        'F':'décédée'
    },
    'etre':{
        'vie':'est',
        'décés':'était'
    },
    'issu':{
        'M':'issu',
        'F':'issue'
    },
    'enfant':{
      'M':'un fils',
      'F':'une fille'
  },
  'fratrie':{
    'M':'un frère',
    'F':'une soeur'
}
}

function getPatho(obj, i,text_neg, text_pos) { // text des éventuelles pathologies
  let keys = Object.keys(obj[i]),
      tag = '_diagnosis_age',
      result = '';
  
  if (!keys.join().includes(tag)) return text_neg // si pas de pathos

  for (var j = 0; j < keys.length; j++) {  
    if (keys[j].indexOf(tag) !== -1) {
      let out = keys[j].substring(0, keys[j].length - tag.length),
          a = obj[i][keys[j]],
          y = obj[i].yob + a;
      result = (result != '' ? result + ' et ' : text_pos);
      
      result += out;
      if(a != "" && a != null) {
        result += " diagnostiqué";
        if(obj[i].yob != "" && obj[i].yob != null) result += " en " + y;
        result += " à l'âge de " + a + " ans";
      }
    };
  }; return result
}

function histoire(obj) {
  let text,
      indexID = getRowPedigreeJS(obj,1), //obj[i].proband == True
      father = getRowPedigreeJS(obj, obj[indexID].father),
      mother = getRowPedigreeJS(obj, obj[indexID].mother),
      gpp = getRowPedigreeJS(obj, obj[father].father),
      gmp = getRowPedigreeJS(obj, obj[father].mother);
      gpm = getRowPedigreeJS(obj, obj[mother].father),
      gmm = getRowPedigreeJS(obj, obj[mother].mother);
  
  text = textIndex(obj, 0) + '<br>';
  text += '<br>' + "Son père" + textline(obj, father);
  text += '<br>' + "Sa mère" + textline(obj, mother);

  if(typeof(gpp) !== 'undefined') text += '<br>' + "Son grand-père paternel" + textline(obj, gpp);
  if(typeof(gmp) !== 'undefined') text += '<br>' + "Sa grand-mère paternelle" + textline(obj, gmp);
  if(typeof(gpm) !== 'undefined') text += '<br>' + "Son grand-père maternel" + textline(obj, gpm);
  if(typeof(gmm) !== 'undefined') text += '<br>' + "Sa grand-mère maternelle" + textline(obj, gmm);
  
  return 'Fonctionnalité non implémentée.'  //text //
}

function textIndex(obj, i){ //pour le cas index
    // motif de consultation
    let result = {'index':'', 'child':'', 'fratrie':''},
        sex = obj[i].sex,
        status = (obj[i].hasOwnProperty('status') ? 'décés' : 'vie');
    
    result.index = textCivil(obj,i)
    result.index += "se présente en consultation de génétique pour évaluation d'une éventuelle prédisposition familiale";
    
    let text_neg = '. ' + dico.pronom[sex] + ' ne présente pas, au jour de la consultation, de pathologie cancéreuse',
        text_pos = " dans le cadre d'un ";
    result.index += getPatho(obj, i,text_neg, text_pos)+'.';

    //enfant & conjoint
    let text_child_neg = " " + dico.pronom[sex] + " n'a pas d'enfant.";
    result.child = getChildList(obj,i,text_child_neg);

    //fratrie
    let text_frat_neg = " " + dico.pronom[sex] + ' ' + dico.etre[status] + " enfant unique.";
    result.fratrie = getFratList(obj,i,text_frat_neg);

    //final
    return result.index + '<br>' + result.fratrie + '<br>' + result.child
}

function textline(obj, i, tag){ //pour les autres individus
  let result = {'civil':'', 'patho':'', 'child':'', 'fratrie':''},
      sex = obj[i].sex,
      status = (obj[i].hasOwnProperty('status') ? 'décés' : 'vie');

  //civil
  result.civil = textCivil(obj,i)
  if(result.civil!='') {result.civil = ' ' + dico.etre[status] + ' ' + result.civil}

  //patho
  let text_neg = (result.civil!='' ? '. ' + dico.pronom[sex]:'')  + ' ne présente pas de pathologie cancéreuse',
      text_pos = (result.civil!='' ? '. ' + dico.pronom[sex]:'')  + ' ' + dico.etre[status] + " suivi pour un "; //" et" + 
  result.patho = getPatho(obj, i,text_neg, text_pos)+'.';

  //fratrie
  let text_frat_neg = " " + dico.pronom[sex] + ' ' + dico.etre[status] + " enfant unique.";
  result.fratrie = getFratList(obj,i,text_frat_neg);

  //final
  return result.civil + result.patho  + ' ' + result.fratrie
}

function textCivil(obj,i){
  let sex = obj[i].sex,
      status = (obj[i].hasOwnProperty('status') ? 'décés' : 'vie');

  let out = (obj[i].proband == true ? dico.civil[sex] + ' ' 
            + (obj[i].yob != '' ? dico.etre[status] + ' ':'')
            : '');
  out += (obj[i].yob != '' && obj[i].yob != null  ? ' ' + dico.naissance[sex] + ' en ' + obj[i].yob : '');
  out += (obj[i].age != '' && obj[i].age != null ? ' (' + obj[i].age +' ans)':'');
  if(obj[i].proband == true && obj[i].yob != '') out += ' et '
  
  return out
}

function getChildList(obj,i,text_child_neg) {
  let child,
      child1 = [], //index des enfants : 1ere union
      child2 = [], //index des enfants : 2ieme union
      fath,
      moth,
      sex = obj[i].sex;

  for (var k = 0; k < obj.length; k++) {
    if (obj[k]['father'] == obj[i]['name'] || obj[k]['mother'] == obj[i]['name']) {
      if (typeof fath === 'undefined') {
        fath = obj[k]['father']
        moth = obj[k]['mother']
        child1.push(k)
      } else if(fath != obj[k]['father'] || moth != obj[k]['mother']) { //si 2ième union
          child2.push(k)
      } else child1.push(k)
    };
  };

  if(child1=='') return text_child_neg

  function childText(child) {
    let result = [];
    for (var c = 0; c < child.length; c++) {
      let k = child[c]
      result = (result == '' ? result : result + ', ') + dico.enfant[obj[k].sex]
      result += textCivil(obj, k)

      //patho
      let text_neg = '',
          text_pos = " suivi pour un ";
      result += getPatho(obj, k,text_neg, text_pos);
    }
    return result
  }

  // texte
  if(child2!="") {
    // x enfants d'une première union : 1 fils etc.,  ; y enfants d'une seconde union : ...
    child = child1.length + (child1.length>1 ? ' enfants' : ' enfant') + " d'une première union : "
    child += childText(child1) // x enfants
    child += ' ; ' + child2.length + (child2.length>1 ? ' enfants' : ' enfant') + " d'une seconde union : "
    child += childText(child2) // x enfants
    child += '.'
  } else {
    child = child1.length + (child1.length>1 ? ' enfants' : ' enfant') + ' : '
    child += childText(child1) // x enfants
    child += '.'
  }
  if(obj[i].proband == true) child = dico.pronom[sex]+ " a " + child

  // conjoint pour le cas index
  if (obj[i].proband == true && child != ".") {
    // conjoint 1 & 2
  }
  return child;
}

function getFratList(obj,i,text_frat_neg) {
  let frat, //fratrie
      fratpm = [], //fratrie issue du père et de la mère
      fratm = [], //fratrie issue du père
      fratp = [], //fratrie issue de la mère
      fath = obj[i]['father'],
      moth = obj[i]['mother'],
      sex = obj[i].sex,
      status = (obj[i].hasOwnProperty('status') ? 'décés' : 'vie'); 
      
  //si pas de parents définis
  if (typeof(fath) === 'undefined' || obj[i].hasOwnProperty('noparents')) return ''
  
  //select siblings
  for (var k = 0; k < obj.length; k++) {
    if (!obj[k].hasOwnProperty('noparents') && obj[k]['father'] == fath && obj[k]['mother'] == moth && k != i) {
      fratpm.push(k)
    }
    if (!obj[k].hasOwnProperty('noparents') && obj[k]['father'] == fath && obj[k]['mother'] != moth && k != i) {
      fratp.push(k)
    }
    if (!obj[k].hasOwnProperty('noparents') && obj[k]['father'] != fath && obj[k]['mother'] == moth && k != i) {
      fratm.push(k)
    }
  };

  //si pas de fratrie
  if(fratpm == '' && fratp == '' && fratm == '') return text_frat_neg
  
  function fratText(frat, suf) {
    let result = [];
    for (var f = 0; f < frat.length; f++) {
      let k = frat[f]
      result = (result == '' ? result : result + ', ') + dico.fratrie[obj[k].sex]
      if(typeof(suf) !== 'undefined') result += suf
      result += textCivil(obj, k)

      //patho
      let text_neg = '',
          text_pos = " suivi pour un ";
      result += getPatho(obj, k,text_neg, text_pos);
    }
    return result
  }
  
  //texte
  frat = dico.pronom[sex] + ' ' + dico.etre[status] + ' ' + dico.issu[sex] + " d'une fratrie de " + (fratpm.length+1) + ' enfants' + ' : '
  frat += fratText(fratpm)
  frat += '.'

  if(fratp != ''){
    frat += ' ' + dico.pronom[sex] + " a "
    frat += fratText(fratp, ' de père')
    frat += '.'
  }

  if(fratm != ''){
    frat += ' ' + dico.pronom[sex] + " a "
    frat += fratText(fratm, ' de mère')
    frat += '.'
  }

  //if(obj[i].proband == true) frat = dico.pronom[sex]+ " a " + frat
  
  return frat;
  
}

function getRowPedigreeJS(obj, id) {
  for (var j = 0; j < obj.length; j++) {
      if (obj[j].name == id) {
          return j;
      };
  };
}

function isFatherPedigreeJS(obj, i, index) {
  return(obj[i].name == obj[index].father);
}

function isMotherPedigreeJS(obj, i, index) {
  return(obj[i].name == obj[index].mother);
}