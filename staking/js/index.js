var currentAddr;
var networkID = 0;
var tokenUEDC = null;
var stakeFlexUEDC = null;
var stakeLockedUEDC = null;
var stakeLockedBNB = null;
var web3 = null;


window.addEventListener('load', () => {
    //Reset
    currentAddr = null;
    tokenUEDC = null;
    stakeFlexUEDC = null;
    stakeLockedUEDC = null;
    stakeLockedBNB = null;
    web3 = null;

    mainContractInfo();
    Connect();
})

$("#btn-logout").click(() => {
    $("#btn-connect").text("Connect wallet");
    $("#btn-connect").prop("disabled", false);
    $("#btn-logout").css("display", "none");

    currentAddr = null;

    tokenUEDC = null;
    stakeFlexUEDC = null;
    stakeLockedUEDC = null;
    stakeLockedBNB = null;
    web3 = null;


    $("#lockbnb-connect").css("display", "block");
    $("#lockbnb-staking").css("display", "none");

    $("#flexuedc-connect").css("display", "block");
    $("#flexuedc-enable").css("display", "none");
    $("#flexuedc-staking").css("display", "none");


    $("#lockuedc-connect").css("display", "block");
    $("#lockuedc-enable").css("display", "none");
    $("#lockuedc-staking").css("display", "none");


    $("#flexuedc-earn").text("0.0");
    $("#flexuedc-earn1").text("0.0");

    $("#flexuedc-staked").text("0.0");
    $("#flexuedc-staked1").text("0.0");


    $("#lockuedc-earn").text("0.0");
    $("#lockuedc-earn1").text("0.0");

    $("#lockuedc-staked").text("0.0");
    $("#lockuedc-staked1").text("0.0");

    $("#lockbnb-earn").text("0.0");
    $("#lockbnb-earn1").text("0.0");

    $("#lockbnb-staked").text("0.0");

})


async function mainContractInfo() {
    if (NETID == 56) {
        web3 = new Web3('https://bsc-dataseed1.binance.org:443');
    } else {
        web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
    }
    tokenUEDC = await new web3.eth.Contract(ABI_TOKEN_UEDC, ADDRESS_TOKEN_UEDC);
    stakeFlexUEDC = await new web3.eth.Contract(ABI_STAKE_FLEX_UEDC, ADDRESS_STAKE_FLEX_UEDC);
    stakeLockedUEDC = await new web3.eth.Contract(ABI_STAKE_LOCKED_UEDC, ADDRESS_STAKE_LOCKED_UEDC);
    stakeLockedBNB = await new web3.eth.Contract(ABI_STAKE_LOCKED_BNB, ADDRESS_STAKE_LOCKED_BNB);
    update();
}

async function Connect() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum)
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            let accounts = await window.ethereum.request({ method: 'eth_accounts' })
            currentAddr = accounts[0]
            window.ethereum.on('chainChanged', (chainId) => {
                window.location.reload();
            });
            runAPP()
            return
        } catch (error) {
            console.error(error)
        }
    }
}


async function runAPP() {
    networkID = await web3.eth.net.getId()
    if (networkID == NETID) {
        tokenUEDC = await new web3.eth.Contract(ABI_TOKEN_UEDC, ADDRESS_TOKEN_UEDC);
        stakeFlexUEDC = await new web3.eth.Contract(ABI_STAKE_FLEX_UEDC, ADDRESS_STAKE_FLEX_UEDC);
        stakeLockedUEDC = await new web3.eth.Contract(ABI_STAKE_LOCKED_UEDC, ADDRESS_STAKE_LOCKED_UEDC);
        stakeLockedBNB = await new web3.eth.Contract(ABI_STAKE_LOCKED_BNB, ADDRESS_STAKE_LOCKED_BNB);

        //Flexible
        $("#flexuedc-connect").css("display", "none");
        $("#flexuedc-enable").css("display", "block");
        $("#flexuedc-staking").css("display", "none");

        //LockUEDC
        $("#lockuedc-connect").css("display", "none");
        $("#lockuedc-enable").css("display", "block");
        $("#lockuedc-staking").css("display", "none");

        getCurrentWallet();

        update();
        setInterval(update, 10000);
    } else {
        $("#btn-connect-txt").text("Wrong network!");

        if (window.ethereum) {
            const data = [{
                    chainId: '0x38',
                    //chainId: '0x61', //Testnet
                    chainName: 'Binance Smart Chain',
                    nativeCurrency: {
                        name: 'BNB',
                        symbol: 'BNB',
                        decimals: 18
                    },
                    rpcUrls: ['https://bsc-dataseed.binance.org/'],
                    blockExplorerUrls: ['https://bscscan.com/'],
                }]
                /* eslint-disable */
            const tx = await window.ethereum.request({ method: 'wallet_addEthereumChain', params: data }).catch()
            if (tx) {
                console.log(tx)
            }
        }
    }
}


$("#btn-connect-metamask").click(() => {
    if (window.ethereum) {
        Connect();
    } else {
        alert("Please install Metamask first");
    }
})

$("#btn-connect-trust").click(() => {
    if (window.ethereum) {
        Connect();
    } else {
        alert("Please install Trust wallet and open the website on Trust/DApps");
    }
})


$("#btn-connect-wlconnect").click(async() => {
    var WalletConnectProvider = window.WalletConnectProvider.default;
    var walletConnectProvider = new WalletConnectProvider({
        rpc: {
            56: 'https://bsc-dataseed.binance.org/'
        },
        chainId: 56,
        network: 'binance',
    });
    await walletConnectProvider.enable();

    web3 = new Web3(walletConnectProvider);
    var accounts = await web3.eth.getAccounts();
    currentAddr = accounts[0];
    var connectedAddr = currentAddr[0] + currentAddr[1] + currentAddr[2] + currentAddr[3] + currentAddr[4] + currentAddr[5] + '...' + currentAddr[currentAddr.length - 6] + currentAddr[currentAddr.length - 5] + currentAddr[currentAddr.length - 4] + currentAddr[currentAddr.length - 3] + currentAddr[currentAddr.length - 2] + currentAddr[currentAddr.length - 1]
    $("#btn-connect").text(connectedAddr)
    $("#btn-connect").prop("disabled", true);
    $("#btn-logout").css("display", "block");

    walletConnectProvider.on("chainChanged", (chainId) => {
        window.location.reload();
    });
    walletConnectProvider.on("disconnect", (code, reason) => {
        console.log(code, reason);
        window.location.reload();
    });

    runAPP()
})

async function getCurrentWallet() {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
            currentAddr = accounts[0]
            var connectedAddr = currentAddr[0] + currentAddr[1] + currentAddr[2] + currentAddr[3] + currentAddr[4] + currentAddr[5] + '...' + currentAddr[currentAddr.length - 6] + currentAddr[currentAddr.length - 5] + currentAddr[currentAddr.length - 4] + currentAddr[currentAddr.length - 3] + currentAddr[currentAddr.length - 2] + currentAddr[currentAddr.length - 1]
            $("#btn-connect").text(connectedAddr);
            $("#btn-connect").prop("disabled", true);
            $("#btn-logout").css("display", "block");

        }
    }
}

var yourUEDCBalance = 0;
var yourBNBBalance = 0;
var uedcInFlex = 0;

async function updateParameters() {

    if (currentAddr != '' && currentAddr != null && currentAddr != undefined) {


        $("#ref-url").text('https://' + window.location.host + '/staking/?ref=' + currentAddr);


        $("#lockbnb-connect").css("display", "none");
        $("#lockbnb-staking").css("display", "block");

        web3.eth.getBalance(currentAddr, function(err, result) {
            if (err) {
                console.log(err)
            } else {
                yourBNBBalance = result / 1e18;
                $("#lockbnb-balance").text((result / 1e18).toFixed(2) + " BNB");
            }
        })
    } else {
        $("#lockbnb-connect").css("display", "block");
        $("#lockbnb-staking").css("display", "none");
    }

    if (tokenUEDC) {
        if (currentAddr != null && currentAddr != undefined) {
            tokenUEDC.methods.balanceOf(currentAddr).call().then(res => {
                yourUEDCBalance = (res / 1e18);
                var your_balance = (res / 1e18).toFixed(2);
                $("#flexuedc-balance").text("Balance: " + your_balance + " UEDCs");
                $("#lockuedc-balance").text("Balance: " + your_balance + " UEDCs");
            })

            tokenUEDC.methods.allowance(currentAddr, ADDRESS_STAKE_FLEX_UEDC).call().then(res => {
                if ((res / 1e18) < 20000000) {
                    $("#flexuedc-connect").css("display", "none");
                    $("#flexuedc-enable").css("display", "block");
                    $("#flexuedc-staking").css("display", "none");
                } else {
                    $("#flexuedc-connect").css("display", "none");
                    $("#flexuedc-enable").css("display", "none");
                    $("#flexuedc-staking").css("display", "block");
                }
            })

            tokenUEDC.methods.allowance(currentAddr, ADDRESS_STAKE_LOCKED_UEDC).call().then(res => {
                if ((res / 1e18) < 20000000) {
                    $("#lockuedc-connect").css("display", "none");
                    $("#lockuedc-enable").css("display", "block");
                    $("#lockuedc-staking").css("display", "none");
                } else {
                    $("#lockuedc-connect").css("display", "none");
                    $("#lockuedc-enable").css("display", "none");
                    $("#lockuedc-staking").css("display", "block");
                }
            })
        }
    }

    if (stakeFlexUEDC) {
        stakeFlexUEDC.methods.stakedTokenSupply().call().then(res => {
            totalStaked = (res / 1e18).toFixed(2);
            $("#flexuedc-total").text(totalStaked + " UEDCs");
            $("#flexuedc-total1").text(totalStaked + " UEDCs");
        })

        if (currentAddr != null && currentAddr != undefined) {
            stakeFlexUEDC.methods.pendingReward(currentAddr).call().then(res => {
                $("#flexuedc-earn").text((res / 1e18).toFixed(2));
                $("#flexuedc-earn1").text((res / 1e18).toFixed(2));

                if ((res / 1e18).toFixed(2) > 0) {
                    $("#flexuedc-collect").addClass("enable");
                }
            });

            stakeFlexUEDC.methods.userInfo(currentAddr).call().then(res => {
                $("#flexuedc-staked").text((res.amount / 1e18).toFixed(2));
                $("#flexuedc-staked1").text((res.amount / 1e18).toFixed(2));
                uedcInFlex = (res.amount / 1e18);
            })
        }
    }


    if (stakeLockedUEDC) {
        stakeLockedUEDC.methods.totalStaked().call().then(res => {
            var totalStaked = (res / 1e18).toFixed(2);
            $("#lockuedc-total").text(totalStaked + " UEDCs");
            $("#lockuedc-total1").text(totalStaked + " UEDCs");
        })

        if (currentAddr != null && currentAddr != undefined) {
            stakeLockedUEDC.methods.getUserAvailable(currentAddr).call().then(res => {
                $("#lockuedc-earn").text((res / 1e18).toFixed(2));
                $("#lockuedc-earn1").text((res / 1e18).toFixed(2));

                if ((res / 1e18).toFixed(2) > 0) {
                    $("#lockuedc-collect").addClass("enable");
                }
            });

            stakeLockedUEDC.methods.getUserTotalDeposits(currentAddr).call().then(res => {
                $("#lockuedc-staked").text((res / 1e18).toFixed(2));
                $("#lockuedc-staked1").text("Balance: " + (res / 1e18).toFixed(2) + " UEDCs");
            })
        }
    }

    if (stakeLockedBNB) {
        stakeLockedBNB.methods.totalStaked().call().then(res => {
            var totalStaked = (res / 1e18).toFixed(2);
            $("#lockbnb-total").text(totalStaked + " BNB");
            $("#lockbnb-total1").text(totalStaked + " BNB");
        })

        if (currentAddr != null && currentAddr != undefined) {
            stakeLockedBNB.methods.getUserAvailable(currentAddr).call().then(res => {
                $("#lockbnb-earn").text((res / 1e18).toFixed(4));
                $("#lockbnb-earn1").text((res / 1e18).toFixed(4));

                if ((res / 1e18).toFixed(2) > 0) {
                    $("#lockbnb-collect").addClass("enable");
                }
            });

            stakeLockedBNB.methods.getUserTotalDeposits(currentAddr).call().then(res => {
                $("#lockbnb-staked").text((res / 1e18).toFixed(4));
            })
        }
    }
}

function update() {
    console.log("Update");
    updateParameters();
}

// REFERRAL
var referrer = '0x0000000000000000000000000000000000000000';
var upline = '0x0000000000000000000000000000000000000000';
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName, i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};
var refurl = getUrlParameter('ref');
if (refurl) {
    localStorage.setItem('ref', refurl);
}
upline = localStorage.getItem('ref') ? localStorage.getItem('ref') : referrer;


/*********FLEX ACTION*******/
$("#flexuedc-btn-enable").click(() => {
    try {
        if (tokenUEDC && currentAddr != null && currentAddr != undefined) {
            tokenUEDC.methods.approve(ADDRESS_STAKE_FLEX_UEDC, "2000000000000000000000000000000000").send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {}
})

$("#flexuedc-collect").click(() => {
    try {
        if (stakeFlexUEDC && currentAddr != null && currentAddr != undefined) {
            stakeFlexUEDC.methods.harvest().send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {}
})

$("#flexuedc-staking-confirm").click(() => {
    try {
        if (stakeFlexUEDC && currentAddr != null && currentAddr != undefined) {
            var amount = $("#flexuedc-input-stake").val();
            var tokens = web3.utils.toWei(amount, 'ether');
            stakeFlexUEDC.methods.deposit(tokens).send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {}
    clearFlexUEDCInput();
})

$("#flexuedc-unstaking-confirm").click(() => {
    try {
        if (stakeFlexUEDC && currentAddr != null && currentAddr != undefined) {
            var amount = $("#flexuedc-input-unstake").val();
            var tokens = web3.utils.toWei(amount, 'ether');
            stakeFlexUEDC.methods.withdraw(tokens).send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {};
    clearFlexUEDCInput();
})

$("#flexuedc-compound").click(() => {
    if (stakeFlexUEDC && currentAddr != null && currentAddr != undefined) {
        stakeFlexUEDC.methods.compound().send({
            value: 0,
            from: currentAddr,
        })
    }
})

$('#flexuedc-input-stake').on('input', function() {
    var input = $('#flexuedc-input-stake').val();
    $('#flexuedc-roi').html(input * 1.5 + " UEDCs");
});

$("#flexuedc-stake-max").click(() => {
    $('#flexuedc-input-stake').val(yourUEDCBalance);
    var input = $('#flexuedc-input-stake').val();
    $('#flexuedc-roi').html(input * 1.5 + " UEDCs");
});

$("#flexuedc-unstake-max").click(() => {
    $('#flexuedc-input-unstake').val(uedcInFlex);
});

function clearFlexUEDCInput() {
    $('#flexuedc-input-stake').val(0);
    $('#flexuedc-roi').html("0 UEDCs");
    $('#flexuedc-input-unstake').val(0);
}
/*********LOCK ACTION*******/
$("#lockuedc-btn-enable").click(() => {
    try {
        if (tokenUEDC && currentAddr != null && currentAddr != undefined) {
            tokenUEDC.methods.approve(ADDRESS_STAKE_LOCKED_UEDC, "2000000000000000000000000000000000").send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {}
})

$("#lockuedc-collect").click(() => {
    try {
        if (stakeLockedUEDC && currentAddr != null && currentAddr != undefined) {
            stakeLockedUEDC.methods.withdraw().send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {}
})

$("#lockuedc-compound").click(() => {
    if (stakeLockedUEDC && currentAddr != null && currentAddr != undefined) {
        stakeLockedUEDC.methods.compound().send({
            value: 0,
            from: currentAddr,
        })
    }
})

$("#lockuedc-staking-confirm").click(() => {
    try {
        if (stakeLockedUEDC && currentAddr != null && currentAddr != undefined) {
            var amount = $("#lockuedc-input-stake").val();
            var tokens = web3.utils.toWei(amount, 'ether');
            stakeLockedUEDC.methods.invest(upline, tokens).send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {}
    clearLockUEDCInput();
})

$('#lockuedc-input-stake').on('input', function() {
    var input = $('#lockuedc-input-stake').val();
    $('#lockuedc-roi').html(input * 1.82 + " UEDCs");
});

$("#lockuedc-stake-max").click(() => {
    $('#lockuedc-input-stake').val(yourUEDCBalance);
    var input = $('#lockuedc-input-stake').val();
    $('#lockuedc-roi').html(input * 1.82 + " UEDCs");
});

function clearLockUEDCInput() {
    $('#lockuedc-input-stake').val(0);
    $('#lockuedc-roi').html("0 UEDCs");
}

/*********LOCK BNB*******/
$("#lockbnb-collect").click(() => {
    try {
        if (stakeLockedBNB && currentAddr != null && currentAddr != undefined) {
            stakeLockedBNB.methods.withdraw().send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {}
})

$("#lockbnb-compound").click(() => {
    if (stakeLockedBNB && currentAddr != null && currentAddr != undefined) {
        stakeLockedBNB.methods.compound().send({
            value: 0,
            from: currentAddr,
        })
    }
})

$("#lockbnb-staking-confirm").click(() => {
    try {
        if (stakeLockedBNB && currentAddr != null && currentAddr != undefined) {
            var amount = $("#lockbnb-input-stake").val();
            var tokens = web3.utils.toWei(amount, 'ether');
            stakeLockedBNB.methods.invest(upline).send({
                value: tokens,
                from: currentAddr,
            })
        }
    } catch (error) {}
    clearLockBNBInput();
})

$('#lockbnb-input-stake').on('input', function() {
    var input = $('#lockbnb-input-stake').val();
    $('#lockbnb-roi').html(input * 1.82 + " BNB");
});

$("#lockbnb-stake-max").click(() => {
    $('#lockbnb-input-stake').val(yourBNBBalance);
    var input = $('#lockbnb-input-stake').val();
    $('#lockbnb-roi').html(input * 1.82 + " BNB");
});

function clearLockBNBInput() {
    $('#lockbnb-input-stake').val(0);
    $('#lockbnb-roi').html("0 BNB");
}