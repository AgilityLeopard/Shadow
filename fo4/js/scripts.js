var totalPoints = 27;
// var $pointsLeft = 27;

var renderPerks = function () {
    var html = '',
        special = getSPECIAL();

    html += '<tr>';
    for (var i = 0; i < special.length; ++i) {
        html += '<th>' + special[i].special.toUpperCase() + ': ' + special[i].value + '</th>';
    }
    html += '</tr>';

    for (var i = 0; i <= 9; ++i) {
        html += '<tr>';
        for (var j = 0; j < perks.length; ++j) {
            var perk = perks[j].perks[i],
                className = i > special[j].value - 1 ? ' unavailable' : '';

            if (!perk.currentRank) {
                perk.currentRank = 0;
            }

            var title = '';
            title += perk.ranked.map(function (rank) {
                var rankClass = perk.currentRank >= rank.rank ? 'has-rank' : 'no-rank';
                return '<p class=' + rankClass + '>Rank ' + rank.rank + ' (' + rank.level + '): ' + rank.description + '</p>';
            }).join('');
            
            if (perk.currentRank > 0){
            html += '<td><div data-placement="left" data-trigger="hover" data-original-title="' + perk.name + '" rel="popover" data-html="true" data-content="' + title + '" data-i="' + i + '" data-j="' + j + '" class="perk' + className + '" style="background-image:url(\'img/' + perk.img + '\'); background-color:#25a912;">';
            }
            else{
               html += '<td><div data-placement="left" data-trigger="hover" data-original-title="' + perk.name + '" rel="popover" data-html="true" data-content="' + title + '" data-i="' + i + '" data-j="' + j + '" class="perk' + className + '" style="background-image:url(\'img/' + perk.img + '\');">'; 
            }
            
            if (className !== ' unavailable') {
                html += '<div class="overlay"><button class="btn btn-xs btn-danger btn-dec-perk"><i class="glyphicon glyphicon-minus"></i></button>&nbsp;' + perk.currentRank + '/' + perk.ranks + '&nbsp;<button class="btn btn-xs btn-success btn-inc-perk"><i class="glyphicon glyphicon-plus"></i></button></div>';
            }
            html += '</td>';
        }
        html += '</tr>';
    }
    $('.table').html(html);
}

var getJSON = function () {
    return btoa(JSON.stringify({
        s: getSPECIALShort(),
        r: getRanks()
    }));
}

var getRanks = function () {
    var ranks = [];
    for (var i = 0; i < perks.length; ++i) {
        for (var j = 0; j < perks[i].perks.length; ++j) {
            var perk = perks[i].perks[j];
            if (perk.currentRank && perk.currentRank > 0) {
                var item = {};
                item[perk.name] = perk.currentRank;
                ranks.push(item);
            }
        }
    }

    return ranks;
}

var getSPECIALShort = function () {
    var specs = [];
    $('input[type="number"]').each(function () {
        specs.push($(this).val());
    });
    return specs;
};

var getSPECIAL = function () {
    return $('[data-special]').map(function () {
        return {
            special: $(this).data('special'),
            value: $(this).find('input').val()
        };
    });
};

var requiredLevel = function () {
    var total = 0;
    for (var i = 0; i < perks.length; ++i) {
        for (var j = 0; j < perks[i].perks.length; ++j) {
            total += perks[i].perks[j].currentRank;
        }
    }

    var remaining = totalPoints - getAllocatedPoints();
    if (remaining < 0) {
        total += remaining * -1;
    }

    var maxLevel = 0;
    for (var i = 0; i < perks.length; ++i) {
        for (var j = 0; j < perks[i].perks.length; ++j) {
            for (var k = 0; k < perks[i].perks[j].currentRank; ++k) {
                if (perks[i].perks[j].ranked[k].level > maxLevel) {
                    maxLevel = perks[i].perks[j].ranked[k].level;
                }
            }
        }
    }

    if (maxLevel > total)
        total = maxLevel;

    return total;
}

var renderRequiredLevel = function () {
    $('.required-level').text(requiredLevel());
}

var renderAll = function () {
    renderPerks();
    calculatePoints();
    renderRequiredLevel();
    renderSummary();
    window.location.hash = '#' + getJSON();
}

var calculatePoints = function (sdec) {
    var remaining = totalPoints - getAllocatedPoints();
    //if (includeBobbleheads()) {
    //    remaining += 7;
    //}
    if (remaining < 0) {
        remaining = 0;
    }
    $pointsLeft.text(remaining);
}

var getAllocatedPoints = function () {
    var prev = 0;
   for (var i = 0; i < 6; ++i) {
        var curr = $('[data-special] input')[i].value;
        
        switch(curr) {
        case "8":  // if (x === 'value1')
            prev += 0;
	break;
        case "9":  // if (x === 'value1')
            prev += 1;
break;
        case "10":  // if (x === 'value1')
            prev += 2;
break;
        case "11":  // if (x === 'value1')
            prev += 3;
break;
        case "12":  // if (x === 'value1')
            prev += 4;
	break;
        case "13":  // if (x === 'value1')
            prev += 5;
break;
        case "14":  // if (x === 'value1')
            prev += 7;
	break;
        case "15":  // if (x === 'value1')
            prev += 9;
	break;
        default:
         prev += - 1;      
    }
   }  

    return prev;
}

var $pointsLeft = $('.points-left');
        //$includeBobbleheads = $('.include-bobbleheads');

//var includeBobbleheads = function () {
//    return $includeBobbleheads.is(':checked');
//}

var pointsRemaining = function () {
    return parseInt($pointsLeft.text());
}

var renderSummary = function () {
    var html = '';
    for (var i = 0; i < perks.length; ++i) {
        for (var j = 0; j < perks[i].perks.length; ++j) {
            var perk = perks[i].perks[j];
            if (perk.currentRank && perk.currentRank > 0) {
                html += '<li>' + perk.name + ': ' + perk.currentRank + '/' + perk.ranks + '</li>';
                html += '<ul>';
                for (var k = 0; k < perk.currentRank; ++k) {
                    html += '<li>' + perk.ranked[k].description + '</li>';
                }
                html += '</ul>';
            }
        }
    }

    $('.summary').html(html);
    $('[rel="popover"]').popover();
}

$(function () {
    var hash = window.location.hash.replace('#', '');
    if (hash.length > 0) {
        var load = JSON.parse(atob(hash));
        $('input[type=number]').each(function (index) {
            $(this).val(load.s[index]);
        });

        for (var i = 0; i < load.r.length; ++i) {
            var key = Object.keys(load.r[i])[0],
                value = load.r[i][key];

            for (var j = 0; j < perks.length; ++j) {
                for (var k = 0; k < perks[j].perks.length; ++k) {
                    var perk = perks[j].perks[k];
                    if (perk.name === key) {
                        perk.currentRank = value;
                    }
                }
            }
        }
    }

    renderAll();

    //$includeBobbleheads.on('click', function () {
    //    renderAll();
    //});

    $('.btn-inc').on('click', function () {
        var $li = $(this).parent().parent(),
            $input = $li.find('input'),
            value = parseInt($input.val()),
            remaining = totalPoints - getAllocatedPoints();

        //if (remaining === 0)
        //    return;
//     switch(value) {
//         case 9:  // if (x === 'value1')
//             calculatePoints(0);
//             break;
//         case 10:  // if (x === 'value1')
//             calculatePoints(0);
//             break;
//         case 11:  // if (x === 'value1')
//             calculatePoints(0);
//             break;
//         case 12:  // if (x === 'value1')
//             calculatePoints(0);
//             break;
//         case 13:  // if (x === 'value1')
//             calculatePoints(1);
//             break;
//         case 14:  // if (x === 'value1')
//             calculatePoints(1);
//             break;
//         default:
//             calculatePoints(0);
//             break;
// }    

        
        if (value < 15) {
            $input.val(value + 1);
        }

        renderAll();
    });

    $('.btn-dec').on('click', function () {
        var $li = $(this).parent().parent(),
            $input = $li.find('input'),
            value = parseInt($input.val()),
            special = $li.data('special');
        
//     switch(value) {
//         case 9:  // if (x === 'value1')
//             calculatePoints(0);
//             break;
//         case 10:  // if (x === 'value1')
//             calculatePoints(0);
//             break;
//         case 11:  // if (x === 'value1')
//             calculatePoints(0);
//             break;
//         case 12:  // if (x === 'value1')
//             calculatePoints(0);
//             break;
//         case 13:  // if (x === 'value1')
//             calculatePoints(0);
//             break;
//         case 14:  // if (x === 'value1')
//             calculatePoints(-1);
//             break;
//         case 15:  // if (x === 'value1')
//             calculatePoints(-1);
//             break;
//         default:
//             calculatePoints(0);
//          break;
// }   
        if (value > 1) {
            $input.val(value - 1);

            for (var i = 0; i < perks.length; ++i) {
                if (perks[i].special === special) {
                    for (var j = value - 1; j < perks[i].perks.length; ++j) {
                        perks[i].perks[j].currentRank = 0;
                    }
                }
            }
        }

        
        renderAll();
    });

    $('body').on('click', '.btn-inc-perk, .btn-dec-perk', function () {
        var $container = $(this).parent().parent(),
            i = parseInt($container.data('i')),
            j = parseInt($container.data('j')),
            perk = perks[j].perks[i],
            incrementing = $(this).hasClass('btn-inc-perk');

        if (!perk.currentRank)
            perk.currentRank = 0;

        if (incrementing) {
            if (perk.currentRank < perk.ranks) {
                perk.currentRank += 1;
            }
        } else {
            if (perk.currentRank > 0) {
                perk.currentRank -= 1;
            }
        }

        renderAll();
    });
});



