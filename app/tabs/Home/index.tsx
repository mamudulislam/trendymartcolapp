import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useApp } from '../../../contexts/AppContext';
import { useTheme } from '../../../contexts/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/* ────────────────────── Responsive Helper Functions ────────────────────── */
const scale = (size: number) => {
  const baseWidth = 375; // iPhone 13/14 width
  const scaleFactor = Math.min(SCREEN_WIDTH / baseWidth, 1.8); // Limit max scaling
  return size * scaleFactor;
};

const verticalScale = (size: number) => {
  const baseHeight = 812; // iPhone 13/14 height
  const scaleFactor = Math.min(SCREEN_HEIGHT / baseHeight, 1.5);
  return size * scaleFactor;
};

const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Responsive spacing
const rs = (size: number) => moderateScale(size);
// Responsive font size
const rfs = (size: number) => moderateScale(size, 0.3);

// Responsive component size
const getResponsiveCardWidth = (screenWidth: number) => {
  if (screenWidth > 1024) return rs(240); // Large tablets/desktops
  if (screenWidth > 768) return rs(200);  // Tablets
  if (screenWidth < 350) return rs(140);  // Small phones
  return rs(170); // Standard phones
};

/* ────────────────────── Reusable Components ────────────────────── */
const Header = () => {
  const { getCartCount } = useApp();
  const { colors } = useTheme();
  const router = useRouter();
  const cartCount = getCartCount();
  const { width } = useWindowDimensions();
  
  const isLargeScreen = width > 768;
  const isSmallScreen = width < 350;

  return (
    <View style={[
      s.header, 
      { 
        backgroundColor: colors.background,
        paddingHorizontal: isLargeScreen ? rs(30) : rs(20),
        paddingTop: Platform.OS === 'ios' ? rs(20) : rs(30),
        paddingBottom: rs(12),
      }
    ]}>
      <View style={s.headerLeft}>
        <Image 
          source={{ uri: 'https://placehold.co/56x56/6366f1/fff?text=JW' }} 
          style={[
            s.avatar, 
            { 
              borderColor: colors.primary,
              width: isLargeScreen ? rs(56) : rs(52),
              height: isLargeScreen ? rs(56) : rs(52),
              borderRadius: isLargeScreen ? rs(28) : rs(26),
            }
          ]} 
        />
        <View>
          <Text style={[
            s.welcome, 
            { color: colors.textSecondary },
            isLargeScreen && s.welcomeLarge,
            isSmallScreen && s.welcomeSmall,
          ]}>
            Welcome back,
          </Text>
          <Text style={[
            s.user, 
            { color: colors.text },
            isLargeScreen && s.userLarge,
            isSmallScreen && s.userSmall,
          ]}>
            John William
          </Text>
        </View>
      </View>

      <View style={[
        s.headerRight,
        { gap: isLargeScreen ? rs(16) : rs(12) }
      ]}>
        <TouchableOpacity 
          style={[
            s.iconBtn, 
            { 
              backgroundColor: colors.surface,
              padding: isLargeScreen ? rs(10) : rs(8),
              borderRadius: rs(999),
            }
          ]}
          onPress={() => router.push('/notifications')}
        >
          <Ionicons 
            name="notifications-outline" 
            size={isLargeScreen ? rs(26) : rs(24)} 
            color={colors.text} 
          />
          <View style={[
            s.badge, 
            { 
              backgroundColor: colors.error,
              width: isLargeScreen ? rs(12) : rs(10),
              height: isLargeScreen ? rs(12) : rs(10),
              borderRadius: isLargeScreen ? rs(6) : rs(5),
            }
          ]} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            s.cartBtn, 
            { 
              backgroundColor: colors.primary,
              padding: isLargeScreen ? rs(11) : rs(9),
              borderRadius: rs(999),
            }
          ]}
          onPress={() => router.push('/tabs/Cart')}
        >
          <Ionicons 
            name="cart-outline" 
            size={isLargeScreen ? rs(28) : rs(26)} 
            color="#fff" 
          />
          {cartCount > 0 && (
            <View style={[
              s.cartBadge,
              {
                minWidth: isLargeScreen ? rs(22) : rs(18),
                height: isLargeScreen ? rs(22) : rs(18),
                borderRadius: isLargeScreen ? rs(11) : rs(9),
              }
            ]}>
              <Text style={[
                s.cartBadgeText,
                { fontSize: isLargeScreen ? rfs(12) : rfs(11) }
              ]}>
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SearchBar = () => {
  const [focused, setFocused] = useState(false);
  const { colors } = useTheme();
  const { searchQuery, setSearchQuery } = useApp();
  const { width } = useWindowDimensions();
  
  const isLargeScreen = width > 768;
  const isSmallScreen = width < 350;

  return (
    <View style={[
      s.searchContainer, 
      { 
        backgroundColor: colors.surface,
        borderColor: focused ? colors.primary : colors.border,
        borderRadius: isLargeScreen ? rs(20) : rs(16),
        paddingHorizontal: isLargeScreen ? rs(18) : rs(14),
        paddingVertical: isLargeScreen ? rs(14) : rs(12),
        borderWidth: StyleSheet.hairlineWidth,
      }
    ]}>
      <Ionicons 
        name="search" 
        size={isLargeScreen ? rs(22) : rs(20)} 
        color={focused ? colors.primary : colors.textSecondary} 
      />
      <TextInput
        placeholder="Search products, brands…"
        placeholderTextColor={colors.textSecondary}
        style={[
          s.searchInput, 
          { 
            color: colors.text,
            fontSize: isLargeScreen ? rfs(16) : rfs(15),
            marginLeft: isLargeScreen ? rs(12) : rs(10),
          }
        ]}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel="Search products"
      />
      {focused && searchQuery && (
        <TouchableOpacity 
          onPress={() => setSearchQuery('')}
          accessibilityLabel="Clear search"
        >
          <Ionicons 
            name="close" 
            size={isLargeScreen ? rs(22) : rs(20)} 
            color={colors.primary} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

/* Hero Banner Carousel */
const Banner = () => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  
  const isLargeScreen = width > 768;
  const isSmallScreen = width < 350;
  const bannerWidth = width - (isLargeScreen ? rs(80) : rs(40));
  const bannerHeight = isLargeScreen ? rs(240) : isSmallScreen ? rs(160) : rs(200);

  const banners: Array<{ title: string; discount: string; collection: string; color: [string, string] }> = [
    { title: 'Winter Sale', discount: '30% OFF', collection: 'Cozy Essentials', color: ['#4c1d95', '#7c3aed'] },
    { title: 'Tech Fest', discount: 'UP 50%', collection: 'Gadgets & Gear', color: ['#1e293b', '#475569'] },
    { title: 'Style Drop', discount: '25% OFF', collection: 'Streetwear', color: ['#0f172a', '#1e293b'] },
  ];

  return (
    <View style={[
      s.bannerWrapper,
      {
        marginHorizontal: isLargeScreen ? rs(30) : rs(20),
        marginVertical: isLargeScreen ? rs(24) : rs(16),
        height: bannerHeight,
        borderRadius: isLargeScreen ? rs(28) : rs(24),
      }
    ]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {banners.map((b, i) => (
          <LinearGradient 
            key={i} 
            colors={b.color} 
            style={[
              s.bannerCard,
              { 
                width: bannerWidth, 
                height: bannerHeight,
                padding: isLargeScreen ? rs(28) : rs(20),
              }
            ]}
          >
            <View style={s.bannerText}>
              <Text style={[
                s.bannerTag,
                { fontSize: isLargeScreen ? rfs(16) : rfs(14) }
              ]}>
                {b.title}
              </Text>
              <Text style={[
                s.bannerDiscount,
                { 
                  fontSize: isLargeScreen ? rfs(42) : rfs(36),
                  marginVertical: isLargeScreen ? rs(8) : rs(4),
                }
              ]}>
                {b.discount}
              </Text>
              <Text style={[
                s.bannerSubtitle,
                { fontSize: isLargeScreen ? rfs(18) : rfs(16) }
              ]}>
                {b.collection}
              </Text>
              <TouchableOpacity style={[
                s.bannerCta,
                {
                  marginTop: isLargeScreen ? rs(16) : rs(12),
                  paddingHorizontal: isLargeScreen ? rs(20) : rs(16),
                  paddingVertical: isLargeScreen ? rs(8) : rs(6),
                  borderRadius: rs(999),
                }
              ]}>
                <Text style={[
                  s.bannerCtaText,
                  { fontSize: isLargeScreen ? rfs(14) : rfs(13) }
                ]}>
                  Shop Now
                </Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: 'https://placehold.co/180x180/fff/000?text=Img' }}
              style={[
                s.bannerImg,
                {
                  width: isLargeScreen ? rs(130) : rs(110),
                  height: isLargeScreen ? rs(130) : rs(110),
                  borderRadius: isLargeScreen ? rs(20) : rs(16),
                  marginLeft: isLargeScreen ? rs(20) : rs(12),
                }
              ]}
            />
          </LinearGradient>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={[s.dots, { marginTop: isLargeScreen ? rs(16) : rs(12) }]}>
        {banners.map((_, i) => {
          const inputRange = [(i - 1) * bannerWidth, i * bannerWidth, (i + 1) * bannerWidth];
          const dotWidth = scrollX.interpolate({ 
            inputRange, 
            outputRange: [rs(8), rs(20), rs(8)], 
            extrapolate: 'clamp' 
          });
          const opacity = scrollX.interpolate({ 
            inputRange, 
            outputRange: [0.3, 1, 0.3], 
            extrapolate: 'clamp' 
          });
          return (
            <Animated.View 
              key={i} 
              style={[
                s.dot, 
                { 
                  height: rs(8), 
                  borderRadius: rs(4), 
                  marginHorizontal: rs(4),
                  width: dotWidth, 
                  opacity, 
                  backgroundColor: colors.primary 
                }
              ]} 
            />
          );
        })}
      </View>
    </View>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  
  const isLargeScreen = width > 768;
  const isSmallScreen = width < 350;

  return (
    <View style={[
      s.sectionHeader,
      {
        paddingHorizontal: isLargeScreen ? rs(30) : rs(20),
        marginBottom: isLargeScreen ? rs(16) : rs(12),
      }
    ]}>
      <Text style={[
        s.sectionTitle, 
        { 
          color: colors.text,
          fontSize: isLargeScreen ? rfs(26) : rfs(22),
        }
      ]}>
        {title}
      </Text>
      <TouchableOpacity style={s.seeAll}>
        <Text style={[
          s.seeAllText, 
          { 
            color: colors.primary,
            fontSize: isLargeScreen ? rfs(15) : rfs(14),
            marginRight: rs(4),
          }
        ]}>
          See All
        </Text>
        <Ionicons 
          name="chevron-forward" 
          size={isLargeScreen ? rs(18) : rs(16)} 
          color={colors.primary} 
        />
      </TouchableOpacity>
    </View>
  );
};

const ProductCard: React.FC<{ product: any; onPress: () => void }> = ({ product, onPress }) => {
  const { colors } = useTheme();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const { width } = useWindowDimensions();
  const scale = useRef(new Animated.Value(1)).current;
  const inWishlist = isInWishlist(product.id);
  
  const isLargeScreen = width > 768;
  const isSmallScreen = width < 350;
  const cardWidth = getResponsiveCardWidth(width);
  const imageHeight = isLargeScreen ? rs(160) : isSmallScreen ? rs(120) : rs(140);

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scale, { 
        toValue: 0.96, 
        duration: 80, 
        useNativeDriver: true 
      }),
      Animated.timing(scale, { 
        toValue: 1, 
        duration: 80, 
        useNativeDriver: true 
      }),
    ]).start();
  };

  const handleWishlist = (e: any) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    animatePress();
    addToCart(product);
  };

  return (
    <Animated.View style={[
      s.card, 
      { 
        backgroundColor: colors.card,
        borderColor: colors.borderLight,
        transform: [{ scale }],
        width: cardWidth,
        borderRadius: isLargeScreen ? rs(24) : rs(20),
        marginHorizontal: rs(8),
      }
    ]}>
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={onPress}
        accessibilityLabel={`View ${product.name}`}
      >
        <View style={s.cardImageWrapper}>
          <Image 
            source={{ uri: product.image }} 
            style={[
              s.cardImage,
              { 
                height: imageHeight,
                borderTopLeftRadius: isLargeScreen ? rs(24) : rs(20),
                borderTopRightRadius: isLargeScreen ? rs(24) : rs(20),
              }
            ]} 
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={[
              s.favBtn, 
              { 
                backgroundColor: inWishlist ? colors.error : 'rgba(0,0,0,0.4)',
                padding: isLargeScreen ? rs(8) : rs(6),
                borderRadius: rs(999),
                top: rs(10),
                right: rs(10),
              }
            ]}
            onPress={handleWishlist}
            accessibilityLabel={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Ionicons 
              name={inWishlist ? 'heart' : 'heart-outline'} 
              size={isLargeScreen ? rs(22) : rs(20)} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>

        <View style={[
          s.cardBody,
          { padding: isLargeScreen ? rs(16) : rs(12) }
        ]}>
          <Text style={[
            s.cardName, 
            { 
              color: colors.text,
              fontSize: isLargeScreen ? rfs(16) : rfs(14),
              lineHeight: isLargeScreen ? rfs(20) : rfs(18),
              marginBottom: rs(4),
            }
          ]} 
            numberOfLines={2}
            accessibilityLabel={product.name}
          >
            {product.name}
          </Text>
          <Text style={[
            s.cardPrice, 
            { 
              color: colors.primary,
              fontSize: isLargeScreen ? rfs(20) : rfs(18),
            }
          ]}>
            ${product.price.toFixed(2)}
          </Text>

          <TouchableOpacity 
            style={[
              s.addBtn, 
              { 
                backgroundColor: colors.primary,
                marginTop: rs(8),
                paddingVertical: isLargeScreen ? rs(8) : rs(6),
                borderRadius: isLargeScreen ? rs(14) : rs(12),
              }
            ]} 
            onPress={handleAddToCart}
            accessibilityLabel="Add to cart"
          >
            <Ionicons 
              name="add" 
              size={isLargeScreen ? rs(20) : rs(18)} 
              color="#fff" 
            />
            <Text style={[
              s.addBtnText,
              { 
                fontSize: isLargeScreen ? rfs(14) : rfs(13),
                marginLeft: rs(6),
              }
            ]}>
              Add
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ProductSection: React.FC<{ title: string; data: any[] }> = ({ title, data }) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  
  const isLargeScreen = width > 768;
  const cardWidth = getResponsiveCardWidth(width);
  const cardMargin = rs(8);
  const visibleCards = Math.floor(width / (cardWidth + cardMargin * 2));

  return (
    <View style={s.section}>
      <SectionHeader title={title} />
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={[
          s.sectionScroll,
          {
            paddingLeft: isLargeScreen ? rs(30) : rs(12),
            paddingRight: isLargeScreen ? rs(30) : rs(12),
          }
        ]}
        snapToInterval={cardWidth + cardMargin * 2}
        decelerationRate="fast"
      >
        {data.map((p) => (
          <ProductCard 
            key={p.id} 
            product={p} 
            onPress={() => router.push(`/product/${p.id}`)}
          />
        ))}
        {/* Add empty space at the end for better scrolling */}
        <View style={{ width: rs(20) }} />
      </ScrollView>
    </View>
  );
};

/* ────────────────────── Main Screen ────────────────────── */
export default function HomeTab() {
  const { colors } = useTheme();
  const { products, searchQuery } = useApp();
  const { width } = useWindowDimensions();
  
  const isLargeScreen = width > 768;

  // Filter products based on search query
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredProducts = filteredProducts.slice(0, 6);
  const popularProducts = filteredProducts.slice(6, 12);

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <View style={s.frame}>
        {/* Fixed Header */}
        <Header />

        {/* Fixed Search */}
        <View style={[
          s.searchWrapper,
          { 
            paddingHorizontal: isLargeScreen ? rs(30) : rs(20),
            paddingVertical: isLargeScreen ? rs(16) : rs(12),
          }
        ]}>
          <SearchBar />
        </View>

        {/* Scrollable Area */}
        <ScrollView 
          style={s.scroll} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
        >
          <Banner />
          {featuredProducts.length > 0 && (
            <ProductSection title="Featured Deals" data={featuredProducts} />
          )}
          {popularProducts.length > 0 && (
            <ProductSection title="Most Popular" data={popularProducts} />
          )}
          {filteredProducts.length === 0 && searchQuery && (
            <View style={[
              s.emptyState,
              { paddingVertical: rs(60) }
            ]}>
              <Ionicons 
                name="search-outline" 
                size={rs(64)} 
                color={colors.textSecondary} 
              />
              <Text style={[
                s.emptyText, 
                { 
                  color: colors.textSecondary,
                  fontSize: rfs(16),
                  marginTop: rs(16),
                }
              ]}>
                No products found
              </Text>
            </View>
          )}
          <View style={[
            s.bottomSpacer,
            { height: rs(60) }
          ]} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ────────────────────── Styles ────────────────────── */
const s = StyleSheet.create({
  /* Layout */
  container: { 
    flex: 1,
  },
  frame: {
    width: '100%',
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    columnGap: rs(12) 
  },
  avatar: {
    borderWidth: 2,
  },
  welcome: { 
    fontSize: rfs(13), 
    fontWeight: '500' 
  },
  welcomeLarge: {
    fontSize: rfs(15),
  },
  welcomeSmall: {
    fontSize: rfs(11),
  },
  user: { 
    fontSize: rfs(20), 
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    letterSpacing: -0.3,
  },
  userLarge: {
    fontSize: rfs(24),
  },
  userSmall: {
    fontSize: rfs(18),
  },
  headerRight: { 
    flexDirection: 'row',
  },
  iconBtn: { 
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: rs(6),
    right: rs(6),
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  cartBtn: { 
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: rs(-4),
    right: rs(-4),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#6366f1',
  },
  cartBadgeText: { 
    color: '#6366f1', 
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    paddingHorizontal: rs(4),
  },

  /* Search */
  searchWrapper: {},
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  searchInput: { 
    flex: 1,
    fontWeight: '400',
  },

  /* Hero Banner */
  bannerWrapper: {
    overflow: 'hidden',
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerText: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  bannerTag: { 
    color: '#c4b5fd', 
    fontWeight: '600', 
    letterSpacing: 1 
  },
  bannerDiscount: { 
    color: '#fff', 
    fontWeight: Platform.OS === 'ios' ? '800' : 'bold',
  },
  bannerSubtitle: { 
    color: '#e5e7eb', 
    fontWeight: '500' 
  },
  bannerCta: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
  },
  bannerCtaText: { 
    color: '#fff', 
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
  },
  bannerImg: {
    resizeMode: 'cover',
  },
  dots: { 
    flexDirection: 'row', 
    justifyContent: 'center' 
  },
  dot: {},

  /* Section */
  section: { 
    marginBottom: rs(32) 
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { 
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
  },
  seeAll: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  seeAllText: { 
    fontWeight: '600' 
  },

  sectionScroll: { 
    flexGrow: 1,
  },

  /* Product Card */
  card: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: rs(8) },
    shadowOpacity: 0.1,
    shadowRadius: rs(12),
    elevation: 12,
  },
  cardImageWrapper: { 
    position: 'relative' 
  },
  cardImage: { 
    width: '100%',
    resizeMode: 'cover',
  },
  favBtn: {
    position: 'absolute',
  },
  cardBody: {},
  cardName: { 
    fontWeight: '600',
  },
  cardPrice: { 
    fontWeight: Platform.OS === 'ios' ? '800' : 'bold',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { 
    color: '#fff', 
    fontWeight: '600' 
  },

  /* Misc */
  bottomSpacer: {},
  emptyState: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  emptyText: { 
    fontWeight: '500',
  },
});