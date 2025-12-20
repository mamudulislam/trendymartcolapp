import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useApp } from '../../../contexts/AppContext';
import { useTheme } from '../../../contexts/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/* ────────────────────── Responsive Helper Functions ────────────────────── */
const scale = (size: number) => {
  const baseWidth = 375; // iPhone 13/14 width
  const scaleFactor = SCREEN_WIDTH / baseWidth;
  const scaledSize = size * scaleFactor;
  
  // Limit scaling for very large screens
  if (SCREEN_WIDTH > 768) {
    return Math.min(scaledSize, size * 1.5);
  }
  
  return scaledSize;
};

const verticalScale = (size: number) => {
  const baseHeight = 812; // iPhone 13/14 height
  const scaleFactor = SCREEN_HEIGHT / baseHeight;
  const scaledSize = size * scaleFactor;
  
  if (SCREEN_HEIGHT > 1024) {
    return Math.min(scaledSize, size * 1.5);
  }
  
  return scaledSize;
};

const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Responsive spacing
const rs = (size: number) => moderateScale(size);

// Responsive font size
const rfs = (size: number) => moderateScale(size, 0.3);

/* ────────────────────── Reusable Components ────────────────────── */
const WishlistHeader = ({ itemCount }: { itemCount: number }) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  
  const isLargeScreen = width > 768;
  const isSmallScreen = width < 350;
  
  return (
    <View style={[s.header, isLargeScreen && s.headerLarge]}>
      <Text style={[
        s.headerTitle, 
        { color: colors.text },
        isLargeScreen && s.headerTitleLarge,
        isSmallScreen && s.headerTitleSmall
      ]}>
        My Wishlist
      </Text>
      <Text style={[
        s.headerSubtitle, 
        { color: colors.textSecondary },
        isLargeScreen && s.headerSubtitleLarge,
        isSmallScreen && s.headerSubtitleSmall
      ]}>
        {itemCount} {itemCount === 1 ? 'item' : 'items'} saved
      </Text>
    </View>
  );
};

const WishlistCard: React.FC<{
  item: any;
  onRemove: (id: number) => void;
  onMoveToCart: (id: number) => void;
}> = ({ item, onRemove, onMoveToCart }) => {
  const { colors } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isLargeScreen = width > 768;
  const isSmallScreen = width < 350;

  const handleRemove = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => onRemove(item.id));
  };

  const handleMoveToCart = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => onMoveToCart(item.id));
  };

  return (
    <Animated.View
      style={[
        s.card,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
        isLargeScreen && s.cardLarge,
        isSmallScreen && s.cardSmall,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        style={[s.cardInner, {
          backgroundColor: colors.card,
          borderColor: colors.borderLight
        }]}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <View style={s.imageWrapper}>
          <Image 
            source={{ uri: item.image }} 
            style={[
              s.cardImage,
              isLargeScreen && s.cardImageLarge,
              isSmallScreen && s.cardImageSmall,
            ]} 
          />
          {!item.inStock && (
            <View style={[s.outOfStock, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
              <Text style={[
                s.outOfStockText,
                isLargeScreen && s.outOfStockTextLarge,
                isSmallScreen && s.outOfStockTextSmall,
              ]}>
                Out of Stock
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[
              s.heartBtn, 
              { backgroundColor: colors.surface },
              isLargeScreen && s.heartBtnLarge,
              isSmallScreen && s.heartBtnSmall,
            ]}
            onPress={handleRemove}
          >
            <Ionicons 
              name="heart" 
              size={isLargeScreen ? rs(24) : rs(20)} 
              color={colors.error} 
            />
          </TouchableOpacity>
        </View>

        <View style={s.cardBody}>
          <Text style={[
            s.cardName, 
            { color: colors.text },
            isLargeScreen && s.cardNameLarge,
            isSmallScreen && s.cardNameSmall,
          ]} 
            numberOfLines={2}
          >
            {item.name}
          </Text>
          <Text style={[
            s.cardPrice, 
            { color: colors.primary },
            isLargeScreen && s.cardPriceLarge,
            isSmallScreen && s.cardPriceSmall,
          ]}>
            ${item.price.toFixed(2)}
          </Text>

          <View style={[
            s.actionRow,
            isLargeScreen && s.actionRowLarge,
            isSmallScreen && s.actionRowSmall,
          ]}>
            <TouchableOpacity
              style={[
                s.actionBtn,
                s.moveBtn,
                { 
                  backgroundColor: item.inStock ? colors.primary : colors.textTertiary,
                  flex: isSmallScreen ? 0.85 : 1,
                },
                !item.inStock && s.disabledBtn,
                isLargeScreen && s.actionBtnLarge,
              ]}
              onPress={handleMoveToCart}
              disabled={!item.inStock}
            >
              <Ionicons 
                name="cart-outline" 
                size={isLargeScreen ? rs(18) : rs(16)} 
                color="#fff" 
              />
              <Text style={[
                s.actionBtnText,
                isLargeScreen && s.actionBtnTextLarge,
                isSmallScreen && s.actionBtnTextSmall,
              ]}>
                 Cart
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                s.actionBtn, 
                s.removeBtn, 
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.error,
                  flex: isSmallScreen ? 0.15 : undefined,
                },
                isLargeScreen && s.actionBtnLarge,
              ]}
              onPress={handleRemove}
            >
              <Ionicons 
                name="trash-outline" 
                size={isLargeScreen ? rs(18) : rs(16)} 
                color={colors.error} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const EmptyWishlist = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  
  const isLargeScreen = width > 768;
  const isSmallScreen = width < 350;
  const isLandscape = width > height;

  return (
    <View style={[
      s.emptyContainer, 
      { 
        backgroundColor: colors.background,
        paddingHorizontal: isLandscape ? width * 0.2 : rs(40),
      }
    ]}>
      <Ionicons 
        name="heart-outline" 
        size={isLargeScreen ? rs(100) : rs(80)} 
        color={colors.textTertiary} 
      />
      <Text style={[
        s.emptyTitle, 
        { color: colors.text },
        isLargeScreen && s.emptyTitleLarge,
        isSmallScreen && s.emptyTitleSmall,
      ]}>
        Your Wishlist is Empty
      </Text>
      <Text style={[
        s.emptySubtitle, 
        { color: colors.textSecondary },
        isLargeScreen && s.emptySubtitleLarge,
        isSmallScreen && s.emptySubtitleSmall,
      ]}>
        Save items you love for later!
      </Text>
      <TouchableOpacity
        style={[
          s.emptyBtn, 
          { backgroundColor: colors.primary },
          isLargeScreen && s.emptyBtnLarge,
          isSmallScreen && s.emptyBtnSmall,
        ]}
        onPress={() => router.push('/tabs/Home')}
      >
        <Text style={[
          s.emptyBtnText,
          isLargeScreen && s.emptyBtnTextLarge,
          isSmallScreen && s.emptyBtnTextSmall,
        ]}>
          Select your product
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/* ────────────────────── Main Screen ────────────────────── */
export default function WishlistTab() {
  const { colors } = useTheme();
  const { wishlist, removeFromWishlist, addToCart } = useApp();
  const { width } = useWindowDimensions();

  // Dynamic column calculation based on screen width
  const getNumColumns = () => {
    if (width > 1024) return 4;
    if (width > 768) return 3;
    if (width < 350) return 1;
    return 2;
  };

  const NUM_COLUMNS = getNumColumns();
  const CARD_WIDTH = (width - rs(60)) / NUM_COLUMNS;

  const moveToCart = (id: number) => {
    const item = wishlist.find((i) => i.id === id);
    if (item && item.inStock) {
      addToCart(item);
      removeFromWishlist(id);
    }
  };

  if (wishlist.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ width: CARD_WIDTH }}>
            <WishlistCard
              item={item}
              onRemove={removeFromWishlist}
              onMoveToCart={moveToCart}
            />
          </View>
        )}
        numColumns={NUM_COLUMNS}
        ListHeaderComponent={<WishlistHeader itemCount={wishlist.length} />}
        contentContainerStyle={[
          s.listContent,
          NUM_COLUMNS > 2 && s.listContentLarge,
          NUM_COLUMNS === 1 && s.listContentSingle,
        ]}
        columnWrapperStyle={
          NUM_COLUMNS > 1 ? s.columnWrapper : undefined
        }
        showsVerticalScrollIndicator={false}
        key={`columns-${NUM_COLUMNS}`} // Re-render when columns change
      />
    </SafeAreaView>
  );
}

/* ────────────────────── Styles ────────────────────── */
const s = StyleSheet.create({
  container: { flex: 1 },
  listContent: { 
    padding: rs(27), 
    paddingBottom: rs(40),
  },
  listContentLarge: {
    paddingHorizontal: rs(40),
  },
  listContentSingle: {
    paddingHorizontal: rs(20),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: rs(16),
  },

  /* Header */
  header: { 
    marginBottom: rs(27),
    marginTop: Platform.OS === 'android' ? rs(20) : 0,
  },
  headerLarge: {
    marginBottom: rs(32),
    alignItems: 'center',
  },
  headerTitle: { 
    fontSize: rfs(28), 
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
  },
  headerTitleLarge: {
    fontSize: rfs(32),
  },
  headerTitleSmall: {
    fontSize: rfs(24),
  },
  headerSubtitle: { 
    fontSize: rfs(14), 
    marginTop: rs(4) 
  },
  headerSubtitleLarge: {
    fontSize: rfs(16),
  },
  headerSubtitleSmall: {
    fontSize: rfs(12),
  },

  /* Card */
  card: {
    flex: 1,
    marginHorizontal: rs(8),
  },
  cardLarge: {
    marginHorizontal: rs(10),
  },
  cardSmall: {
    marginHorizontal: rs(4),
  },
  cardInner: {
    borderRadius: rs(20),
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: rs(4) },
    shadowOpacity: 0.1,
    shadowRadius: rs(8),
    elevation: 4,
    marginBottom: rs(16),
  },
  imageWrapper: { 
    position: 'relative' 
  },
  cardImage: { 
    width: '100%', 
    height: rs(140), 
    resizeMode: 'cover',
  },
  cardImageLarge: {
    height: rs(160),
  },
  cardImageSmall: {
    height: rs(120),
  },
  outOfStock: {
    position: 'absolute',
    top: rs(8),
    left: rs(8),
    paddingHorizontal: rs(8),
    paddingVertical: rs(4),
    borderRadius: rs(8),
  },
  outOfStockText: { 
    color: '#fff', 
    fontSize: rfs(10), 
    fontWeight: '600' 
  },
  outOfStockTextLarge: {
    fontSize: rfs(12),
  },
  outOfStockTextSmall: {
    fontSize: rfs(8),
  },
  heartBtn: {
    position: 'absolute',
    top: rs(8),
    right: rs(8),
    padding: rs(6),
    borderRadius: rs(20),
  },
  heartBtnLarge: {
    padding: rs(8),
  },
  heartBtnSmall: {
    padding: rs(4),
  },
  cardBody: { 
    padding: rs(12) 
  },
  cardName: { 
    fontSize: rfs(14), 
    fontWeight: '600', 
    marginBottom: rs(4),
    lineHeight: rfs(18),
  },
  cardNameLarge: {
    fontSize: rfs(16),
    lineHeight: rfs(20),
  },
  cardNameSmall: {
    fontSize: rfs(12),
    lineHeight: rfs(16),
  },
  cardPrice: { 
    fontSize: rfs(18), 
    fontWeight: '700', 
    marginBottom: rs(8) 
  },
  cardPriceLarge: {
    fontSize: rfs(20),
  },
  cardPriceSmall: {
    fontSize: rfs(16),
  },

  actionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    gap: rs(8),
  },
  actionRowLarge: {
    gap: rs(12),
  },
  actionRowSmall: {
    gap: rs(4),
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: rs(8),
    borderRadius: rs(12),
  },
  actionBtnLarge: {
    paddingVertical: rs(10),
    borderRadius: rs(14),
  },
  moveBtn: {
    flex: 1,
  },
  removeBtn: {
    borderWidth: 1,
    minWidth: rs(40),
  },
  disabledBtn: {
    opacity: 0.6,
  },
  actionBtnText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: rfs(12), 
    marginLeft: rs(4),
  },
  actionBtnTextLarge: {
    fontSize: rfs(14),
  },
  actionBtnTextSmall: {
    fontSize: rfs(10),
  },

  /* Empty State */
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingBottom: rs(40),
  },
  emptyTitle: { 
    fontSize: rfs(24), 
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold', 
    marginTop: rs(24), 
    textAlign: 'center' 
  },
  emptyTitleLarge: {
    fontSize: rfs(28),
  },
  emptyTitleSmall: {
    fontSize: rfs(20),
  },
  emptySubtitle: { 
    fontSize: rfs(16), 
    marginTop: rs(8), 
    textAlign: 'center',
    lineHeight: rfs(22),
  },
  emptySubtitleLarge: {
    fontSize: rfs(18),
    lineHeight: rfs(24),
  },
  emptySubtitleSmall: {
    fontSize: rfs(14),
    lineHeight: rfs(18),
  },
  emptyBtn: {
    marginTop: rs(24),
    paddingHorizontal: rs(28),
    paddingVertical: rs(14),
    borderRadius: rs(16),
  },
  emptyBtnLarge: {
    paddingHorizontal: rs(32),
    paddingVertical: rs(16),
    borderRadius: rs(20),
  },
  emptyBtnSmall: {
    paddingHorizontal: rs(24),
    paddingVertical: rs(12),
    borderRadius: rs(12),
  },
  emptyBtnText: { 
    color: '#fff', 
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold', 
    fontSize: rfs(16) 
  },
  emptyBtnTextLarge: {
    fontSize: rfs(18),
  },
  emptyBtnTextSmall: {
    fontSize: rfs(14),
  },
});