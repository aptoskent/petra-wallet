//:!:>moon
module MoonCoin::moon_coin {
    struct MoonCoin0 {}
    struct MoonCoin3 {}
    struct MoonCoin12 {}

    fun init_module(sender: &signer) {
        aptos_framework::managed_coin::initialize<MoonCoin0>(
            sender,
            b"Moon Coin",
            b"MOON",
            0,
            false,
        );
        aptos_framework::managed_coin::initialize<MoonCoin3>(
            sender,
            b"Moon Coin",
            b"MOON",
            3,
            false,
        );
        aptos_framework::managed_coin::initialize<MoonCoin12>(
            sender,
            b"Moon Coin",
            b"MOON",
            12,
            false,
        );
    }
}
//<:!:moon
