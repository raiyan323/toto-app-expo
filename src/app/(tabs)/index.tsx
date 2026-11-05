import * as Clipboard from "expo-clipboard";
import { Check, Copy, Plus, RotateCcw, Smile, X } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { ID, TablesDB } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import { client } from "../../lib/appwrite";

const db = new TablesDB(client);

const DATABASE_ID = "6ad96cca002d32e3afa6";
const TABLE_ID = "6ad9703300294fbdb0ca";

type Post = {
  $id: string;
  $createdAt: string;
  name: string;
  content: string;
  category?: string;
};

const CATEGORIES = [
  "Funny",
  "Sports",
  "Politics",
  "Technology",
  "Gaming",
  "Education",
  "News",
  "Lifestyle",
  "Other",
];

function relativeTime(date: string) {
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(date).getTime()) / 1000),
  );

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return new Date(date).toLocaleDateString();
}

function Avatar({ name }: { name: string }) {
  return (
    <View className="h-[42px] w-[42px] items-center justify-center rounded-full bg-[#30254E]">
      <Text className="text-[17px] font-extrabold text-[#C4B5FD]">
        {name.trim().charAt(0).toUpperCase() || "?"}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [posting, setPosting] = useState(false);
  const [composer, setComposer] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [copiedPost, setCopiedPost] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    try {
      const result = await db.listRows({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
      });

      const sorted = [...result.rows].sort(
        (a, b) =>
          new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime(),
      );

      setPosts(sorted as Post[]);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load posts.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const refreshPosts = useCallback(() => {
    setRefreshing(true);
    void loadPosts();
  }, [loadPosts]);

  const toggleExpanded = (postId: string) => {
    setExpandedPosts((previous) => {
      const next = new Set(previous);

      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }

      return next;
    });
  };

  const copyPost = async (post: Post) => {
    try {
      await Clipboard.setStringAsync(post.content);
      setCopiedPost(post.$id);
    } catch {
      Alert.alert("Copy failed", "Couldn't copy this post.");
    }
  };

  const publish = async () => {
    if (!name.trim() || !content.trim() || !category) {
      Alert.alert(
        "Missing information",
        "Enter your name, write a post, and select a category.",
      );
      return;
    }

    if (content.trim().length > 2000) {
      Alert.alert("Post too long", "Maximum length is 2000 characters.");
      return;
    }

    setPosting(true);

    try {
      await db.createRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {
          name: name.trim(),
          content: content.trim(),
          category,
        },
      });

      setContent("");
      setCategory("");
      setComposer(false);
      await loadPosts();
    } catch (e) {
      Alert.alert(
        "Couldn't publish",
        e instanceof Error ? e.message : "Please try again.",
      );
    } finally {
      setPosting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#09090F]">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-white/[0.08] px-5 pb-4">
        <View className="mr-3 h-[46px] w-[46px] items-center justify-center overflow-hidden rounded-2xl bg-[#241C40]">
          <Image
            source={require("../../../assets/images/icon.png")}
            className="h-full w-full"
            resizeMode="contain"
          />
        </View>

        <View className="flex-1">
          <Text className="text-[27px] font-black tracking-tight text-white">
            ToTo<Text className="text-[#A78BFA]">.</Text>
          </Text>
          <Text className="text-xs text-[#8F8BA4]">
            A place for your thoughts.
          </Text>
        </View>

        <View className="flex-row gap-2">
          <Pressable
            onPress={() => setComposer(true)}
            accessibilityRole="button"
            accessibilityLabel="Create a post"
            className="h-12 w-12 items-center justify-center rounded-full bg-violet-500"
          >
            <Plus color="#FFFFFF" size={22} />
          </Pressable>

          <Pressable
            onPress={refreshPosts}
            disabled={refreshing}
            accessibilityRole="button"
            accessibilityLabel="Refresh posts"
            className="h-12 w-12 items-center justify-center rounded-full bg-white/[0.06]"
          >
            <RotateCcw color="#FFFFFF" size={20} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-5 pb-8"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshPosts}
            tintColor="#A78BFA"
          />
        }
      >
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-xl font-extrabold text-white">
            Fresh thoughts
          </Text>
          <Text className="text-xs font-medium text-[#B6A0FF]">
            Community ✦
          </Text>
        </View>

        {loading && posts.length === 0 && (
          <View className="items-center py-12">
            <ActivityIndicator color="#A78BFA" size="large" />
            <Text className="mt-3 text-sm text-[#8F8BA4]">
              Loading thoughts...
            </Text>
          </View>
        )}

        {!!error && (
          <View className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <Text className="text-red-300">{error}</Text>
            <Pressable
              onPress={() => void loadPosts()}
              className="mt-3 self-start"
            >
              <Text className="font-bold text-[#B6A0FF]">Try again</Text>
            </Pressable>
          </View>
        )}

        {!loading && !error && posts.length === 0 && (
          <View className="items-center px-6 py-10">
            <Smile color="#A78BFA" size={36} />
            <Text className="mt-4 text-lg font-bold text-white">
              Its a little quiet here.
            </Text>
            <Text className="mt-2 text-center text-sm leading-6 text-[#8F8BA4]">
              Be the first to share a thought!
            </Text>
            <Pressable
              onPress={() => setComposer(true)}
              className="mt-5 rounded-xl bg-[#8B5CF6] px-5 py-3"
            >
              <Text className="font-bold text-white">Write a post</Text>
            </Pressable>
          </View>
        )}

        {/* Posts */}
        {posts.map((post) => {
          const expanded = expandedPosts.has(post.$id);

          return (
            <View
              key={post.$id}
              className="mb-3 rounded-2xl border border-[#262535] bg-[#14141F] p-4"
            >
              {/* Author */}
              <View className="flex-row items-center">
                <Avatar name={post.name} />

                <View className="ml-3 flex-1">
                  <Text className="font-bold text-white">{post.name}</Text>
                  <Text className="mt-1 text-[11px] text-[#8F8BA4]">
                    {relativeTime(post.$createdAt)} · Community
                  </Text>
                </View>

                {/* Copy button */}
                <Pressable
                  onPress={() => void copyPost(post)}
                  accessibilityRole="button"
                  accessibilityLabel="Copy post text"
                  hitSlop={8}
                  className="h-10 w-10 items-center justify-center rounded-full bg-white/[0.06]"
                >
                  {copiedPost === post.$id ? (
                    <Check color="#A78BFA" size={19} />
                  ) : (
                    <Copy color="#A5A1B8" size={19} />
                  )}
                </Pressable>
              </View>

              {/* Category */}
              {post.category ? (
                <View className="mt-4 self-start rounded-full border border-[#49376F] bg-[#241C40] px-3 py-1.5">
                  <Text className="text-xs font-semibold text-[#C4B5FD]">
                    {post.category}
                  </Text>
                </View>
              ) : null}

              {/* Fixed-height preview; expanded text shows in full */}
              <Text
                numberOfLines={expanded ? undefined : 4}
                className="mb-1 mt-3 text-[15px] leading-6 text-[#E4E1EE]"
              >
                {post.content}
              </Text>

              {/* Expand/collapse */}
              {post.content.split("\n").join(" ").length > 0 &&
                (post.content.length > 160 ||
                  post.content.split("\n").length > 4) && (
                  <Pressable
                    onPress={() => toggleExpanded(post.$id)}
                    accessibilityRole="button"
                    className="mb-3 mt-1 self-start py-1"
                  >
                    <Text className="text-sm font-bold text-[#B6A0FF]">
                      {expanded ? "Show less" : "Show more"}
                    </Text>
                  </Pressable>
                )}
            </View>
          );
        })}
      </ScrollView>

      {/* Create post modal */}
      <Modal
        visible={composer}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          if (!posting) setComposer(false);
        }}
      >
        <View className="flex-1 justify-center bg-black/80 px-5">
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="flex-grow justify-center py-6"
          >
            <View className="rounded-3xl border border-[#342A50] bg-[#151520] p-5">
              <View className="mb-5 flex-row items-center">
                <View className="flex-1">
                  <Text className="text-2xl font-extrabold text-white">
                    Share a thought
                  </Text>
                  <Text className="mt-1 text-xs text-[#8F8BA4]">
                    Your voice deserves a space.
                  </Text>
                </View>

                <Pressable
                  disabled={posting}
                  onPress={() => setComposer(false)}
                  className="h-10 w-10 items-center justify-center rounded-full bg-white/[0.06]"
                >
                  <X color="#E4E1EE" size={21} />
                </Pressable>
              </View>

              <Text className="mb-2 text-sm font-semibold text-[#E4E1EE]">
                Your name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#77748D"
                maxLength={50}
                autoCapitalize="words"
                returnKeyType="next"
                className="mb-4 rounded-xl border border-[#302D40] bg-[#09090F] px-4 py-3.5 text-base text-white"
              />

              <Text className="mb-2 text-sm font-semibold text-[#E4E1EE]">
                Your thought
              </Text>
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="What's on your mind?"
                placeholderTextColor="#77748D"
                multiline
                maxLength={2000}
                textAlignVertical="top"
                className="min-h-[130px] rounded-xl border border-[#302D40] bg-[#09090F] px-4 py-3.5 text-base leading-6 text-white"
              />

              <Text className="mt-2 text-right text-xs text-[#8F8BA4]">
                {content.length}/2000
              </Text>

              <Text className="mb-3 mt-4 text-sm font-semibold text-[#E4E1EE]">
                Choose a category
              </Text>

              <View className="mb-5 flex-row flex-wrap gap-2">
                {CATEGORIES.map((item) => {
                  const selected = category === item;

                  return (
                    <Pressable
                      key={item}
                      onPress={() => setCategory(item)}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      className={`rounded-full border px-4 py-2.5 ${
                        selected
                          ? "border-[#A78BFA] bg-[#49376F]"
                          : "border-[#302D40] bg-[#09090F]"
                      }`}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          selected ? "text-white" : "text-[#A5A1B8]"
                        }`}
                      >
                        {selected ? "✓ " : ""}
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                disabled={
                  posting || !name.trim() || !content.trim() || !category
                }
                onPress={() => void publish()}
                className={`items-center justify-center rounded-xl py-4 ${
                  posting || !name.trim() || !content.trim() || !category
                    ? "bg-[#49376F]"
                    : "bg-[#8B5CF6]"
                }`}
              >
                {posting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="font-extrabold text-white">Publish ↗</Text>
                )}
              </Pressable>

              <Text className="mt-4 text-center text-xs text-[#77748D]">
                Your post will be visible to everyone.
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
