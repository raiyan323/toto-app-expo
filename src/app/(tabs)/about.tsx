import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import {
    ArrowLeft,
    ChevronRight,
    Copy,
    GitGraph,
    Heart,
    Image as ImageIcon,
    Info,
    Mail,
    ShieldCheck,
    Users,
    X,
} from "lucide-react-native";
import { useState } from "react";
import {
    Alert,
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BG = "#0D0B14";
const CARD = "#171321";
const PURPLE = "#A78BFA";
const MUTED = "#9892A8";

// Your USDT receiving wallet address
const USDT_WALLET_ADDRESS = "TLq9BEeSwvWDd8J4TpvvfHu36kAXVHqEjL";
const USDT_NETWORK = "TRC20";

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <View className="flex-row items-center px-4 py-4">
      <View
        className="mr-4 h-11 w-11 items-center justify-center rounded-2xl"
        style={{ backgroundColor: "#29203F" }}
      >
        {icon}
      </View>

      <View className="flex-1">
        <Text className="text-base font-semibold text-white">{title}</Text>
        <Text className="mt-1 text-sm leading-5" style={{ color: MUTED }}>
          {description}
        </Text>
      </View>
    </View>
  );
}

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center px-4 py-4">
      {icon}

      <View className="ml-3 flex-1">
        <Text className="text-sm font-semibold text-white">{title}</Text>
        <Text className="mt-1 text-xs" style={{ color: MUTED }}>
          {subtitle}
        </Text>
      </View>

      <ChevronRight color={MUTED} size={19} />
    </Pressable>
  );
}

export default function AboutScreen() {
  const router = useRouter();
  const [donateModalVisible, setDonateModalVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyWalletAddress = async () => {
    try {
      await Clipboard.setStringAsync(USDT_WALLET_ADDRESS);
      setCopied(true);
    } catch (error) {
      console.error("Clipboard error:", error);
      Alert.alert("Copy failed", "Please try again.");
    }
  };

  const handleDonate = () => {
    setCopied(false);
    setDonateModalVisible(true);
  };

  return (
    <>
      {/* Donate Modal */}
      <Modal
        visible={donateModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setDonateModalVisible(false)}
      >
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: "rgba(0,0,0,0.78)" }}
        >
          <View
            className="w-full rounded-3xl border p-5"
            style={{
              backgroundColor: CARD,
              borderColor: "#4C3974",
              maxWidth: 420,
            }}
          >
            {/* Modal header */}
            <View className="mb-5 flex-row items-center">
              <View
                className="mr-3 h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "#29203F" }}
              >
                <Heart color={PURPLE} size={24} />
              </View>

              <View className="flex-1">
                <Text className="text-xl font-bold text-white">
                  Support ToTo
                </Text>
                <Text className="mt-1 text-sm" style={{ color: MUTED }}>
                  Your support means a lot!
                </Text>
              </View>

              <Pressable
                onPress={() => setDonateModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Close donation modal"
                className="h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: "#292333" }}
              >
                <X color="#FFFFFF" size={19} />
              </Pressable>
            </View>

            {/* Network */}
            <Text className="mb-2 text-sm" style={{ color: MUTED }}>
              USDT NETWORK
            </Text>

            <View
              className="mb-5 flex-row items-center justify-between rounded-2xl p-4"
              style={{ backgroundColor: BG }}
            >
              <Text className="font-semibold text-white">
                TRON ({USDT_NETWORK})
              </Text>
              <ShieldCheck color={PURPLE} size={20} />
            </View>

            {/* Wallet address */}
            <Text className="mb-2 text-sm" style={{ color: MUTED }}>
              WALLET ADDRESS
            </Text>

            <View
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: BG,
                borderColor: "#342847",
              }}
            >
              <Text selectable className="text-sm leading-6 text-white">
                {USDT_WALLET_ADDRESS}
              </Text>
            </View>

            <Text className="mt-3 text-xs leading-5" style={{ color: MUTED }}>
              Make sure your sending network matches TRC20 before transferring.
              Always verify the address before sending.
            </Text>

            {/* Copy address */}
            <Pressable
              onPress={() => void copyWalletAddress()}
              accessibilityRole="button"
              accessibilityLabel="Copy USDT wallet address"
              className="mt-5 flex-row items-center justify-center rounded-2xl px-4 py-4"
              style={{ backgroundColor: copied ? "#29203F" : "#8B5CF6" }}
            >
              {copied ? (
                <ShieldCheck color="#FFFFFF" size={19} />
              ) : (
                <Copy color="#FFFFFF" size={19} />
              )}

              <Text className="ml-2 font-bold text-white">
                {copied ? "Address Copied!" : "Copy Wallet Address"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setDonateModalVisible(false)}
              className="mt-3 items-center rounded-2xl px-4 py-3"
            >
              <Text className="font-semibold" style={{ color: MUTED }}>
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* About Page */}
      <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center px-5 py-4">
            <Pressable
              onPress={() => router.back()}
              className="mr-4 h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: CARD }}
            >
              <ArrowLeft color="white" size={21} />
            </Pressable>

            <Text className="text-xl font-bold text-white">About ToTo</Text>
          </View>

          {/* App branding */}
          <View className="items-center px-6 pb-7 pt-6">
            <View
              className="h-24 w-24 items-center justify-center overflow-hidden rounded-[28px]"
              style={{
                backgroundColor: "#241C40",
                borderWidth: 1,
                borderColor: "#4C3974",
              }}
            >
              <Image
                source={require("../../../assets/images/icon.png")}
                className="h-full w-full"
                resizeMode="contain"
              />
            </View>

            <Text className="mt-5 text-3xl font-extrabold text-white">
              ToTo
            </Text>

            <Text className="mt-2 text-center text-sm" style={{ color: MUTED }}>
              Share moments. Connect with people.
            </Text>

            <View
              className="mt-4 rounded-full px-4 py-2"
              style={{ backgroundColor: "#241C40" }}
            >
              <Text className="text-xs font-semibold" style={{ color: PURPLE }}>
                Version 1.0.0
              </Text>
            </View>
          </View>

          {/* About description */}
          <View
            className="mx-5 rounded-3xl p-5"
            style={{ backgroundColor: CARD }}
          >
            <Text className="text-lg font-bold text-white">
              Your space to connect
            </Text>

            <Text className="mt-3 text-sm leading-6" style={{ color: MUTED }}>
              ToTo is a social app concept designed to help people share
              everyday moments, discover posts, and stay connected with their
              community.
            </Text>
          </View>

          {/* Donate section */}
          <View
            className="mx-5 mt-5 rounded-3xl border p-5"
            style={{
              backgroundColor: CARD,
              borderColor: "#4C3974",
            }}
          >
            <View className="flex-row items-center">
              <View
                className="mr-3 h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "#29203F" }}
              >
                <Heart color={PURPLE} size={23} />
              </View>

              <View className="flex-1">
                <Text className="text-lg font-bold text-white">
                  Support ToTo
                </Text>
                <Text className="mt-1 text-sm" style={{ color: MUTED }}>
                  Support the project with a USDT donation.
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleDonate}
              accessibilityRole="button"
              accessibilityLabel="Donate USDT"
              className="mt-5 flex-row items-center justify-center rounded-2xl bg-[#8B5CF6] px-4 py-4"
            >
              <Heart color="#FFFFFF" size={19} />
              <Text className="ml-2 font-bold text-white">Donate USDT</Text>
              <Copy color="#FFFFFF" size={17} style={{ marginLeft: 10 }} />
            </Pressable>

            <Text
              className="mt-3 text-center text-xs leading-5"
              style={{ color: MUTED }}
            >
              Verify the wallet address and network before sending.
            </Text>
          </View>

          {/* Features */}
          <Text className="mb-3 ml-5 mt-7 text-lg font-bold text-white">
            What you can do
          </Text>

          <View
            className="mx-5 overflow-hidden rounded-3xl"
            style={{ backgroundColor: CARD }}
          >
            <Feature
              icon={<ImageIcon color={PURPLE} size={21} />}
              title="Share your moments"
              description="Create posts and share what matters to you."
            />

            <View
              className="ml-16 h-px"
              style={{ backgroundColor: "#292333" }}
            />

            <Feature
              icon={<Users color={PURPLE} size={21} />}
              title="Connect with people"
              description="Discover a community and follow other users."
            />

            <View
              className="ml-16 h-px"
              style={{ backgroundColor: "#292333" }}
            />

            <Feature
              icon={<Heart color={PURPLE} size={21} />}
              title="Engage and interact"
              description="Enjoy social interactions as features become available."
            />

            <View
              className="ml-16 h-px"
              style={{ backgroundColor: "#292333" }}
            />

            <Feature
              icon={<ShieldCheck color={PURPLE} size={21} />}
              title="Privacy matters"
              description="Review privacy and security settings when available."
            />
          </View>

          {/* Information */}
          <Text className="mb-3 ml-5 mt-7 text-lg font-bold text-white">
            Information
          </Text>

          <View
            className="mx-5 overflow-hidden rounded-3xl"
            style={{ backgroundColor: CARD }}
          >
            <MenuItem
              icon={<Info color={PURPLE} size={20} />}
              title="App version"
              subtitle="ToTo 1.0.0"
              onPress={() => Alert.alert("App version", "ToTo 1.0.0")}
            />

            <View
              className="ml-12 h-px"
              style={{ backgroundColor: "#292333" }}
            />

            <MenuItem
              icon={<Mail color={PURPLE} size={20} />}
              title="Contact & support"
              subtitle="Get help with the app"
              onPress={() =>
                Alert.alert(
                  "Contact & support",
                  "Contact details are not configured yet.",
                )
              }
            />

            <View
              className="ml-12 h-px"
              style={{ backgroundColor: "#292333" }}
            />

            <MenuItem
              icon={<ShieldCheck color={PURPLE} size={20} />}
              title="Privacy policy"
              subtitle="Learn how your information is handled"
              onPress={() =>
                Alert.alert(
                  "Privacy policy",
                  "Privacy policy link is not configured yet.",
                )
              }
            />

            <View
              className="ml-12 h-px"
              style={{ backgroundColor: "#292333" }}
            />

            <MenuItem
              icon={<GitGraph color={PURPLE} size={20} />}
              title="Open-source credits"
              subtitle="Libraries and tools used by ToTo"
              onPress={() =>
                Alert.alert(
                  "Open-source credits",
                  "ToTo uses Expo, React Native, and open-source libraries.",
                )
              }
            />
          </View>

          {/* Footer */}
          <View className="items-center px-6 pb-10 pt-8">
            <Heart color={PURPLE} size={18} />

            <Text className="mt-3 text-sm font-medium text-white">
              Made with care
            </Text>

            <Text className="mt-2 text-xs" style={{ color: MUTED }}>
              © 2026 ToTo. All rights reserved.
            </Text>

            <Text className="mt-1 text-xs" style={{ color: "#625B70" }}>
              Connect. Share. Belong.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
