//:!:>moon
script {
    fun register(account: &signer) {
        aptos_framework::managed_coin::register<MoonCoin::moon_coin::MoonCoin0>(account);
        aptos_framework::managed_coin::register<MoonCoin::moon_coin::MoonCoin3>(account);
        aptos_framework::managed_coin::register<MoonCoin::moon_coin::MoonCoin12>(account);
    }
}
//<:!:moon
